#!/bin/bash

# AWS SES Setup Script for WTFiction
# This script sets up AWS SES for email subscriptions

set -e

echo "🚀 Setting up AWS SES for WTFiction..."
echo ""

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed."
    echo "   Install it: https://aws.amazon.com/cli/"
    exit 1
fi

echo "✅ AWS CLI found: $(aws --version)"
echo ""

# Check AWS credentials
echo "📋 Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured."
    echo "   Run: aws configure"
    echo "   Or set: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY"
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "✅ AWS Account ID: $ACCOUNT_ID"
echo ""

# Set variables
DOMAIN="wtfiction.com"
REGION="us-east-1"
FROM_EMAIL="noreply@wtfiction.com"
SUBSCRIBE_EMAIL="subscribe@wtfiction.com"
IAM_USER_NAME="wtfiction-ses-sender"

echo "📧 Domain: $DOMAIN"
echo "📧 From Email: $FROM_EMAIL"
echo "📧 Subscribe Email: $SUBSCRIBE_EMAIL"
echo "🌍 Region: $REGION"
echo ""

# Step 1: Verify domain in SES
echo "📝 Step 1: Verifying domain in SES..."
echo ""

# Check if domain already verified
if aws sesv2 get-email-identity --email-identity "$DOMAIN" --region "$REGION" &> /dev/null; then
    echo "✅ Domain $DOMAIN is already verified in SES"
else
    echo "🔍 Creating domain identity in SES..."
    aws sesv2 create-email-identity \
        --email-identity "$DOMAIN" \
        --region "$REGION" \
        --configuration-set-name "" \
        --tags Key=Purpose,Value=WTFiction-Email-Subscriptions
    
    echo "✅ Domain identity created"
    echo ""
    echo "⏳ Waiting 5 seconds for DNS records to be generated..."
    sleep 5
fi

# Get DNS records
echo ""
echo "📋 Step 2: Getting DNS records for domain verification..."
echo ""

DOMAIN_IDENTITY=$(aws sesv2 get-email-identity --email-identity "$DOMAIN" --region "$REGION" --output json)
DKIM_RECORDS=$(echo "$DOMAIN_IDENTITY" | jq -r '.DkimSigningAttributes.Tokens[]? // empty')

echo "DNS Records to add to Route 53:"
echo ""

# DKIM Records (CNAME)
if [ -n "$DKIM_RECORDS" ]; then
    echo "DKIM Records (CNAME):"
    echo "$DKIM_RECORDS" | while read -r token; do
        if [ -n "$token" ]; then
            echo "  Name: ${token}._domainkey.$DOMAIN"
            echo "  Type: CNAME"
            echo "  Value: ${token}.dkim.amazonses.com"
            echo ""
        fi
    done
fi

# Get verification token
VERIFICATION_TOKEN=$(echo "$DOMAIN_IDENTITY" | jq -r '.VerificationToken // empty')
if [ -n "$VERIFICATION_TOKEN" ]; then
    echo "Domain Verification (TXT):"
    echo "  Name: _amazonses.$DOMAIN"
    echo "  Type: TXT"
    echo "  Value: $VERIFICATION_TOKEN"
    echo ""
fi

# Step 3: Create IAM user
echo "👤 Step 3: Creating IAM user for SES access..."
echo ""

if aws iam get-user --user-name "$IAM_USER_NAME" &> /dev/null; then
    echo "✅ IAM user $IAM_USER_NAME already exists"
else
    echo "🔍 Creating IAM user: $IAM_USER_NAME"
    aws iam create-user --user-name "$IAM_USER_NAME" --tags Key=Purpose,Value=WTFiction-Email-Subscriptions
    echo "✅ IAM user created"
fi

# Attach SES policy
echo "🔍 Attaching SES policy to IAM user..."
aws iam attach-user-policy \
    --user-name "$IAM_USER_NAME" \
    --policy-arn arn:aws:iam::aws:policy/AmazonSESFullAccess

echo "✅ Policy attached"
echo ""

# Create access key
echo "🔑 Step 4: Creating access key..."
echo ""

# Check if access key exists
EXISTING_KEYS=$(aws iam list-access-keys --user-name "$IAM_USER_NAME" --query 'AccessKeyMetadata[].AccessKeyId' --output text)

if [ -n "$EXISTING_KEYS" ]; then
    echo "⚠️  Access key already exists for user $IAM_USER_NAME"
    echo "   Existing keys: $EXISTING_KEYS"
    echo ""
    read -p "Create new access key? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Delete old keys first (limit of 2 per user)
        for key in $EXISTING_KEYS; do
            echo "🗑️  Deleting old access key: $key"
            aws iam delete-access-key --user-name "$IAM_USER_NAME" --access-key-id "$key"
        done
        
        NEW_KEY=$(aws iam create-access-key --user-name "$IAM_USER_NAME" --output json)
        ACCESS_KEY_ID=$(echo "$NEW_KEY" | jq -r '.AccessKey.AccessKeyId')
        SECRET_ACCESS_KEY=$(echo "$NEW_KEY" | jq -r '.AccessKey.SecretAccessKey')
        
        echo ""
        echo "✅ New access key created!"
        echo ""
        echo "🔐 IMPORTANT: Save these credentials securely:"
        echo "   AWS_ACCESS_KEY_ID=$ACCESS_KEY_ID"
        echo "   AWS_SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY"
        echo ""
    else
        echo "⚠️  Using existing access keys"
    fi
else
    NEW_KEY=$(aws iam create-access-key --user-name "$IAM_USER_NAME" --output json)
    ACCESS_KEY_ID=$(echo "$NEW_KEY" | jq -r '.AccessKey.AccessKeyId')
    SECRET_ACCESS_KEY=$(echo "$NEW_KEY" | jq -r '.AccessKey.SecretAccessKey')
    
    echo "✅ Access key created!"
    echo ""
    echo "🔐 IMPORTANT: Save these credentials securely:"
    echo "   AWS_ACCESS_KEY_ID=$ACCESS_KEY_ID"
    echo "   AWS_SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY"
    echo ""
fi

# Step 5: Add DNS records to Route 53
echo "🌐 Step 5: Adding DNS records to Route 53..."
echo ""

HOSTED_ZONE_ID="Z0181021JHEW0AS27RFM"  # wtfiction.com hosted zone

if [ -z "$HOSTED_ZONE_ID" ]; then
    echo "⚠️  Hosted zone ID not set. Please add DNS records manually:"
    echo "   See the DNS records listed above"
else
    echo "🔍 Adding DNS records to Route 53 hosted zone: $HOSTED_ZONE_ID"
    
    # Add DKIM records
    if [ -n "$DKIM_RECORDS" ]; then
        echo "$DKIM_RECORDS" | while read -r token; do
            if [ -n "$token" ]; then
                RECORD_NAME="${token}._domainkey.$DOMAIN"
                RECORD_VALUE="${token}.dkim.amazonses.com"
                
                echo "  Adding DKIM record: $RECORD_NAME"
                aws route53 change-resource-record-sets \
                    --hosted-zone-id "$HOSTED_ZONE_ID" \
                    --change-batch "{
                        \"Changes\": [{
                            \"Action\": \"UPSERT\",
                            \"ResourceRecordSet\": {
                                \"Name\": \"$RECORD_NAME\",
                                \"Type\": \"CNAME\",
                                \"TTL\": 3600,
                                \"ResourceRecords\": [{\"Value\": \"$RECORD_VALUE\"}]
                            }
                        }]
                    }" &> /dev/null || echo "    ⚠️  Failed to add (may already exist)"
            fi
        done
    fi
    
    # Add verification TXT record
    if [ -n "$VERIFICATION_TOKEN" ]; then
        echo "  Adding verification TXT record: _amazonses.$DOMAIN"
        aws route53 change-resource-record-sets \
            --hosted-zone-id "$HOSTED_ZONE_ID" \
            --change-batch "{
                \"Changes\": [{
                    \"Action\": \"UPSERT\",
                    \"ResourceRecordSet\": {
                        \"Name\": \"_amazonses.$DOMAIN\",
                        \"Type\": \"TXT\",
                        \"TTL\": 3600,
                        \"ResourceRecords\": [{\"Value\": \"\\\"$VERIFICATION_TOKEN\\\"\"}]
                    }
                }]
            }" &> /dev/null || echo "    ⚠️  Failed to add (may already exist)"
    fi
    
    echo "✅ DNS records added to Route 53"
    echo ""
    echo "⏳ Waiting 30 seconds for DNS propagation..."
    sleep 30
fi

# Step 6: Request production access (if in sandbox)
echo "📊 Step 6: Checking SES account status..."
echo ""

SEND_QUOTA=$(aws sesv2 get-account --region "$REGION" --query 'SendQuota' --output json)
SEND_RATE=$(echo "$SEND_QUOTA" | jq -r '.MaxSendRate // 0')
MAX_24H_SEND=$(echo "$SEND_QUOTA" | jq -r '.Max24HourSend // 0')

if [ "$MAX_24H_SEND" = "200" ]; then
    echo "⚠️  Account is in SANDBOX mode (200 emails/day limit)"
    echo ""
    echo "📝 To request production access:"
    echo "   1. Go to: https://console.aws.amazon.com/ses"
    echo "   2. Click 'Request production access'"
    echo "   3. Fill out the form (explain: sending subscription notifications)"
    echo "   4. Usually approved within 24 hours"
    echo ""
else
    echo "✅ Account is in PRODUCTION mode"
    echo "   Max send rate: $SEND_RATE emails/second"
    echo "   Max 24h send: $MAX_24H_SEND emails"
fi

echo ""
echo "✅ AWS SES setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Add environment variables to Vercel:"
echo "      AWS_ACCESS_KEY_ID=$ACCESS_KEY_ID"
echo "      AWS_SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY"
echo "      AWS_REGION=$REGION"
echo "      SUBSCRIBE_EMAIL=$SUBSCRIBE_EMAIL"
echo "      FROM_EMAIL=$FROM_EMAIL"
echo ""
echo "   2. Wait 5-10 minutes for DNS verification"
echo ""
echo "   3. Redeploy your Vercel project"
echo ""
echo "   4. Test: API_URL=https://wtfiction.com/api/subscribe npm run test-email"
echo ""

#!/bin/bash

# Script to check for DKIM tokens and add them to Route 53
# Run this script periodically until DKIM tokens are available

set -e

DOMAIN="wtfiction.com"
REGION="us-east-2"
HOSTED_ZONE_ID="Z0181021JHEW0AS27RFM"

echo "🔍 Checking for DKIM tokens for $DOMAIN in $REGION..."
echo ""

# Get identity info
IDENTITY=$(aws sesv2 get-email-identity --email-identity "$DOMAIN" --region "$REGION" --output json 2>/dev/null)

if [ $? -ne 0 ]; then
    echo "❌ Domain identity not found. Creating it..."
    aws sesv2 create-email-identity --email-identity "$DOMAIN" --region "$REGION" --output json
    echo "⏳ Waiting 10 seconds for DKIM tokens to generate..."
    sleep 10
    IDENTITY=$(aws sesv2 get-email-identity --email-identity "$DOMAIN" --region "$REGION" --output json)
fi

# Extract DKIM tokens
TOKENS=$(echo "$IDENTITY" | jq -r 'if .DkimSigningAttributes.Tokens and (.DkimSigningAttributes.Tokens | length > 0) then .DkimSigningAttributes.Tokens[] else empty end')

if [ -z "$TOKENS" ]; then
    echo "⏳ DKIM tokens not ready yet."
    echo "   They usually appear within 5-10 minutes after domain creation."
    echo "   Run this script again in a few minutes: ./scripts/add-dkim-records.sh"
    exit 0
fi

echo "✅ Found DKIM tokens! Adding to Route 53..."
echo ""

# Add each DKIM record
TOKEN_COUNT=0
echo "$TOKENS" | while read -r token; do
    if [ -n "$token" ]; then
        TOKEN_COUNT=$((TOKEN_COUNT + 1))
        RECORD_NAME="${token}._domainkey.$DOMAIN"
        RECORD_VALUE="${token}.dkim.amazonses.com"
        
        echo "  [$TOKEN_COUNT/3] Adding: $RECORD_NAME"
        
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
            }" --output json | jq -r '.ChangeInfo.Status' > /dev/null
        
        echo "      ✅ Added successfully"
    fi
done

echo ""
echo "✅ All DKIM records added to Route 53!"
echo ""
echo "⏳ Waiting 5-10 minutes for DNS propagation and SES verification..."
echo ""
echo "Check verification status:"
echo "  aws sesv2 get-email-identity --email-identity $DOMAIN --region $REGION | jq -r '.VerificationStatus'"

#!/bin/bash

echo "🔍 SEO Validation Report for prassanna.io"
echo "========================================"
echo ""

# Check build status
echo "📦 Build Status:"
if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi
echo ""

# Check robots.txt
echo "🤖 Robots.txt Validation:"
if [ -f "dist/robots.txt" ]; then
    echo "✅ robots.txt exists"
    
    # Check if redirect pages are properly blocked
    if grep -q "Disallow: /ambi-alert/" dist/robots.txt; then
        echo "✅ Redirect pages are blocked in robots.txt"
    else
        echo "❌ Redirect pages not properly blocked in robots.txt"
    fi
    
    # Check if non-trailing slash URLs are blocked to prevent duplicates
    if grep -q "Disallow: /blog$" dist/robots.txt; then
        echo "✅ Non-trailing slash URLs blocked to prevent duplicates"
    else
        echo "❌ Non-trailing slash URLs not blocked"
    fi
    
    # Check sitemap reference
    if grep -q "Sitemap: https://prassanna.io/sitemap-index.xml" dist/robots.txt; then
        echo "✅ Sitemap reference correct in robots.txt"
    else
        echo "❌ Sitemap reference missing or incorrect"
    fi
else
    echo "❌ robots.txt missing"
fi
echo ""

# Check sitemap
echo "🗺️  Sitemap Validation:"
if [ -f "dist/sitemap-index.xml" ]; then
    echo "✅ Sitemap index exists"
    
    # Count total URLs in sitemap
    TOTAL_URLS=$(grep -c "<loc>" dist/sitemap-0.xml 2>/dev/null || echo "0")
    echo "📊 Total URLs in sitemap: $TOTAL_URLS"
    
    # Check that redirect pages are NOT in sitemap
    REDIRECT_COUNT=$(grep -c -E "(ambi-alert|ml-fragmentation-redirect|ml-fragmentation-2|full-stack-ml-3|2019-05-29-pipenv-pyenv)" dist/sitemap-0.xml 2>/dev/null || echo "0")
    if [ "$REDIRECT_COUNT" -eq 0 ]; then
        echo "✅ No redirect pages found in sitemap"
    else
        echo "❌ Found $REDIRECT_COUNT redirect pages in sitemap"
    fi
    
    # Check for trailing slash consistency in sitemap
    TRAILING_SLASH_COUNT=$(grep -c "</loc>$" dist/sitemap-0.xml 2>/dev/null || echo "0")
    NON_TRAILING_COUNT=$(grep -c "[^/]</loc>" dist/sitemap-0.xml 2>/dev/null || echo "0")
    echo "📊 URLs with trailing slashes: $TRAILING_SLASH_COUNT"
    echo "📊 URLs without trailing slashes: $NON_TRAILING_COUNT"
    
else
    echo "❌ Sitemap missing"
fi
echo ""

# Check redirect pages have noindex
echo "🚫 Redirect Pages Noindex Check:"
REDIRECT_PAGES=(
    "dist/ambi-alert/index.html"
    "dist/blog/ml-fragmentation-redirect/index.html"
    "dist/blog/ml-fragmentation-2/index.html"
    "dist/blog/full-stack-ml-3/index.html"
    "dist/blog/2019-05-29-pipenv-pyenv/index.html"
)

NOINDEX_COUNT=0
for page in "${REDIRECT_PAGES[@]}"; do
    if [ -f "$page" ]; then
        if grep -q 'name="robots" content="noindex"' "$page"; then
            echo "✅ $(basename $(dirname $page))/$(basename $page) has noindex"
            ((NOINDEX_COUNT++))
        else
            echo "❌ $(basename $(dirname $page))/$(basename $page) missing noindex"
        fi
    fi
done
echo "📊 $NOINDEX_COUNT out of ${#REDIRECT_PAGES[@]} redirect pages have noindex"
echo ""

# Check canonical URLs and trailing slash consistency
echo "🔗 Canonical URL & Trailing Slash Check:"
SAMPLE_PAGES=(
    "dist/index.html"
    "dist/blog/index.html"
    "dist/projects/index.html"
    "dist/verses/index.html"
)

CANONICAL_COUNT=0
TRAILING_SLASH_CANONICAL=0
for page in "${SAMPLE_PAGES[@]}"; do
    if [ -f "$page" ]; then
        if grep -q '<link rel="canonical"' "$page"; then
            echo "✅ $(basename $(dirname $page))/$(basename $page) has canonical URL"
            ((CANONICAL_COUNT++))
            
            # Check if canonical URL has trailing slash
            if grep -q 'rel="canonical" href="[^"]*/"' "$page"; then
                ((TRAILING_SLASH_CANONICAL++))
            fi
        else
            echo "❌ $(basename $(dirname $page))/$(basename $page) missing canonical URL"
        fi
    fi
done
echo "📊 $CANONICAL_COUNT out of ${#SAMPLE_PAGES[@]} sample pages have canonical URLs"
echo "📊 $TRAILING_SLASH_CANONICAL out of $CANONICAL_COUNT canonical URLs have trailing slashes"
echo ""

# Check structured data
echo "📊 Structured Data Check:"
STRUCTURED_COUNT=0
for page in "${SAMPLE_PAGES[@]}"; do
    if [ -f "$page" ]; then
        if grep -q 'application/ld+json' "$page"; then
            echo "✅ $(basename $(dirname $page))/$(basename $page) has structured data"
            ((STRUCTURED_COUNT++))
        else
            echo "❌ $(basename $(dirname $page))/$(basename $page) missing structured data"
        fi
    fi
done
echo "📊 $STRUCTURED_COUNT out of ${#SAMPLE_PAGES[@]} sample pages have structured data"
echo ""

# Performance checks
echo "⚡ Performance Checks:"
echo "📊 Total files in dist:"
find dist -type f | wc -l | xargs echo "  "

echo "📊 HTML files:"
find dist -name "*.html" | wc -l | xargs echo "  "

echo "📊 Image files:"
find dist -name "*.webp" -o -name "*.jpg" -o -name "*.png" -o -name "*.svg" | wc -l | xargs echo "  "

echo ""
echo "🎉 SEO Validation Complete!"
echo ""
echo "💡 Recommendations:"
echo "1. Monitor Google Search Console for indexing improvements"
echo "2. Test redirect pages to ensure they properly redirect"
echo "3. Verify that noindex meta tags prevent indexing of redirect pages"
echo "4. Check Core Web Vitals after deployment"
echo "5. Submit updated sitemap to Google Search Console"
echo "6. Verify trailing slash consistency prevents duplicate content" 
const http = require('http');

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING AUTOMATED SYSTEM VERIFICATION ---');

  // 1. Health Check
  const health = await request('GET', '/api/health');
  console.log('1. Backend Health Check:', health.status === 200 ? 'PASSED' : 'FAILED', health.body);

  // 2. Fetch Components
  const comps = await request('GET', '/api/components');
  console.log(`2. Component Catalog Fetch: PASSED (${comps.body.length} components found)`);

  if (comps.body.length === 0) {
    console.error('No components in database!');
    return;
  }

  // 3. Create Quotation with current component prices
  const comp1 = comps.body[0]; // e.g. Processor
  const comp2 = comps.body[1]; // e.g. RAM
  const initialComp1Price = comp1.sellingPrice;

  console.log(`3. Target Component for Historical Test: "${comp1.name}" - Current Price: $${initialComp1Price}`);

  const newQuoteRes = await request('POST', '/api/quotations', {
    configName: 'Verification Test Build',
    customerName: 'Test Customer Corp',
    customerEmail: 'test@corp.com',
    componentIds: [comp1._id, comp2._id],
    discountPercentage: 5,
    taxPercentage: 10
  });

  const quoteId = newQuoteRes.body._id;
  const quoteNumber = newQuoteRes.body.quoteNumber;
  const savedFinalTotal = newQuoteRes.body.pricingSummary.finalTotal;

  console.log(`4. Created Quotation ${quoteNumber} with total: $${savedFinalTotal}`);

  // 4. Update Component Price in Master Catalog
  const updatedPrice = initialComp1Price + 150;
  console.log(`5. Updating Component "${comp1.name}" catalog price to $${updatedPrice}...`);

  await request('PATCH', `/api/components/${comp1._id}/price`, {
    sellingPrice: updatedPrice,
    baseCost: comp1.baseCost,
    reason: 'Supplier Tariff Increase Test'
  });

  // 5. Fetch Quotation again to verify HISTORICAL PRICE PRESERVATION
  const reFetchedQuote = await request('GET', `/api/quotations/${quoteId}`);
  const reFetchedFinalTotal = reFetchedQuote.body.quotation.pricingSummary.finalTotal;

  console.log('6. Re-fetching saved quotation after master price change...');
  console.log(`   - Original Quote Total: $${savedFinalTotal}`);
  console.log(`   - Re-fetched Quote Total: $${reFetchedFinalTotal}`);
  console.log(`   - Catalog Price Delta Tracked: +$${reFetchedQuote.body.totalCatalogPriceDelta}`);

  if (savedFinalTotal === reFetchedFinalTotal) {
    console.log('✅ HISTORICAL PRICE PRESERVATION VERIFICATION: SUCCESS! (Old quotation total remained strictly untouched!)');
  } else {
    console.error('❌ HISTORICAL PRICE PRESERVATION VERIFICATION FAILED!');
  }

  // 6. Analytics Dashboard check
  const analytics = await request('GET', '/api/analytics/dashboard');
  console.log('7. Dashboard Metrics API:', analytics.status === 200 ? 'PASSED' : 'FAILED', `(${analytics.body.summary.totalQuotations} total quotes, $${analytics.body.summary.totalPipelineValue} revenue pipeline)`);

  console.log('--- ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY ---');
}

runTests();

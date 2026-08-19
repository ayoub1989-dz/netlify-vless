// netlify/functions/proxy.js
exports.handler = async (event, context) => {
  const targetUrl = event.queryStringParameters.url || event.body;
  
  if (!targetUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing target URL" })
    };
  }

  try {
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers: {
        ...event.headers,
        // Remove host header to avoid conflicts
        host: new URL(targetUrl).host
      },
      body: event.body
    });

    const data = await response.text();
    
    return {
      statusCode: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": response.headers.get("content-type") || "text/plain"
      },
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

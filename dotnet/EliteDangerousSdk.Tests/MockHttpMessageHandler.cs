using System.Net;
using System.Text;
using System.Text.Json;

namespace EliteDangerousSdk.Tests;

public class MockHttpMessageHandler : HttpMessageHandler
{
    private readonly Func<HttpRequestMessage, HttpResponseMessage> _handler;

    public MockHttpMessageHandler(Func<HttpRequestMessage, HttpResponseMessage> handler)
    {
        _handler = handler;
    }

    public static HttpClient CreateClient(string baseUrl, Func<HttpRequestMessage, HttpResponseMessage> handler)
    {
        return new HttpClient(new MockHttpMessageHandler(handler)) { BaseAddress = new Uri(baseUrl) };
    }

    public static HttpClient CreateJsonClient(string baseUrl, object response)
    {
        return CreateClient(baseUrl, _ => new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(JsonSerializer.Serialize(response), Encoding.UTF8, "application/json")
        });
    }

    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        return Task.FromResult(_handler(request));
    }
}

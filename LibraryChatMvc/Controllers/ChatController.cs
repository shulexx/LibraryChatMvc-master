using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Json;

namespace LibraryChatMvc.Controllers;

public class ChatController : Controller
{
    private readonly HttpClient _api;

    public ChatController()
    {
        _api = new HttpClient();
        _api.BaseAddress = new Uri("http://localhost:5169/"); // BACKEND URL
    }

    public IActionResult Index() => View();

    [HttpPost]
    public async Task<IActionResult> Ask(string message)
    {
        var res = await _api.PostAsJsonAsync("api/ask", new { Query = message });
        var body = await res.Content.ReadAsStringAsync();
        return Content(body, "application/json");
    }

    [HttpPost]
    public async Task<IActionResult> Summary(string text)
    {
        var res = await _api.PostAsJsonAsync("api/summary", new { Text = text });
        return Content(await res.Content.ReadAsStringAsync(), "application/json");
    }

    [HttpPost]
    public async Task<IActionResult> Search(string text)
    {
        var res = await _api.PostAsJsonAsync("api/search", new { Query = text });
        return Content(await res.Content.ReadAsStringAsync(), "application/json");
    }

    [HttpPost]
    public async Task<IActionResult> Tts(string text)
    {
        var res = await _api.PostAsJsonAsync("api/tts", new { Text = text });
        var bytes = await res.Content.ReadAsByteArrayAsync();
        return File(bytes, "audio/wav");
    }

    [HttpPost]
    public async Task<IActionResult> Ocr(string imageBase64)
    {
        var res = await _api.PostAsJsonAsync("api/ocr", new { ImageBase64 = imageBase64 });
        return Content(await res.Content.ReadAsStringAsync(), "application/json");
    }

}

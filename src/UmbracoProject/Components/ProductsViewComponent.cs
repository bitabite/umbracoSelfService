using Microsoft.AspNetCore.Mvc;
using NPoco.fastJSON;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

public class ProductsViewComponent : ViewComponent
{
    private readonly HttpClient _httpClient;

    public ProductsViewComponent(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }


    public async Task<IViewComponentResult> InvokeAsync()
    {
        var response = await _httpClient.GetAsync("https://dummyjson.com/products");
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            // Deserialize JSON content to a list of Product objects
            var root = JsonSerializer.Deserialize<Root>(content);
            var products = root.products;


            return View(products);
        }
        return Content("Error retrieving products");
    }
}



public class Root
{
    public List<Product> products { get; set; }
    public int total { get; set; }
    public int skip { get; set; }
    public int limit { get; set; }
}
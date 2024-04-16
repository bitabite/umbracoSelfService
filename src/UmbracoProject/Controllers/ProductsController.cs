using Microsoft.AspNetCore.Mvc;

public class ProductsController : Controller
{
    public IActionResult Index()
    {
        return ViewComponent("Products");
    }
}

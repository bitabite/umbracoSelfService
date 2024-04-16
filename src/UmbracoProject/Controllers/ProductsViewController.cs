using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Umbraco.Cms.Web.Common.Controllers;
using NPoco.fastJSON;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Umbraco.Cms.Web.Website.Controllers;
using Umbraco.Cms.Core.Web;
using Umbraco.Cms.Infrastructure.Persistence;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Logging;
using Umbraco.Cms.Core.Routing;


public class ProductsViewController : SurfaceController
{
    public ProductsViewController(IUmbracoContextAccessor umbracoContextAccessor, IUmbracoDatabaseFactory databaseFactory, ServiceContext services, AppCaches appCaches, IProfilingLogger profilingLogger, IPublishedUrlProvider publishedUrlProvider) : base(umbracoContextAccessor, databaseFactory, services, appCaches, profilingLogger, publishedUrlProvider)
    {
    }

    public IActionResult Index()
    {
        return ViewComponent("ProductsViewComponent", new { parameterName = "value" });
    }
}

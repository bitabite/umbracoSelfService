using OfficeOpenXml.FormulaParsing.Excel.Functions.Math;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IProductService
{
    Task<IEnumerable<Product>> GetProducts();
    Task<Product> GetProductById(int id);
    Task AddProduct(Product product);
    Task UpdateProduct(Product product);
    Task DeleteProduct(int id);
}

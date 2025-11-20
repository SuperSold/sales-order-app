using System.Collections.Generic;
using System.Threading.Tasks;
using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Application.Interfaces
{
    public interface ISalesOrderService
    {
        Task<SalesOrder> CreateOrderAsync(SalesOrder order);
        Task<IEnumerable<SalesOrder>> GetAllOrdersAsync();

        Task<SalesOrder?> GetOrderByIdAsync(int id);
        Task<SalesOrder?> UpdateOrderAsync(int id, SalesOrder updatedOrder);
    }
}

using System.Collections.Generic;
using System.Threading.Tasks;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;
using SalesOrderApp.Infrastructure.Repositories;

namespace SalesOrderApp.Application.Services
{
    public class SalesOrderService : ISalesOrderService
    {
        private readonly SalesOrderRepository _repo;

        public SalesOrderService(SalesOrderRepository repo)
        {
            _repo = repo;
        }

        public async Task<SalesOrder> CreateOrderAsync(SalesOrder order)
        {
            var count = await _repo.GetOrderCountAsync();
            order.OrderNumber = $"SO-{(count + 1).ToString("D4")}";

            await _repo.AddAsync(order);
            return order;
        }

        public async Task<IEnumerable<SalesOrder>> GetAllOrdersAsync()
        {
            return await _repo.GetAllWithDetailsAsync();
        }

        public async Task<SalesOrder?> GetOrderByIdAsync(int id)
        {
            return await _repo.GetByIdWithDetailsAsync(id);
        }

        public async Task<SalesOrder?> UpdateOrderAsync(int id, SalesOrder updatedOrder)
        {
            var existing = await _repo.GetByIdWithDetailsAsync(id);
            if (existing == null)
            {
                return null;
            }

            await _repo.UpdateAsync(existing, updatedOrder);
            return existing;
        }
    }
}

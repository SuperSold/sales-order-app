using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SalesOrderApp.Domain.Entities;
using SalesOrderApp.Infrastructure.Data;

namespace SalesOrderApp.Infrastructure.Repositories
{
    public class SalesOrderRepository
    {
        private readonly AppDbContext _db;

        public SalesOrderRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<int> GetOrderCountAsync()
        {
            return await _db.SalesOrders.CountAsync();
        }

        public async Task AddAsync(SalesOrder order)
        {
            _db.SalesOrders.Add(order);
            await _db.SaveChangesAsync();
        }

        public async Task<List<SalesOrder>> GetAllWithDetailsAsync()
        {
            return await _db.SalesOrders
                .Include(o => o.Client)
                .Include(o => o.Lines)
                .ToListAsync();
        }

        public async Task<SalesOrder?> GetByIdWithDetailsAsync(int id)
        {
            return await _db.SalesOrders
                .Include(o => o.Client)
                .Include(o => o.Lines)
                .FirstOrDefaultAsync(o => o.SalesOrderId == id);
        }

        public async Task UpdateAsync(SalesOrder existingOrder, SalesOrder newData)
        {
            existingOrder.ClientId = newData.ClientId;
            existingOrder.OrderDate = newData.OrderDate;
            existingOrder.Notes = newData.Notes;

            
            _db.SalesOrderLines.RemoveRange(existingOrder.Lines);
            existingOrder.Lines = newData.Lines;

            await _db.SaveChangesAsync();
        }
    }
}

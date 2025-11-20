using System.Collections.Generic;
using System.Threading.Tasks;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;
using SalesOrderApp.Infrastructure.Repositories;

namespace SalesOrderApp.Application.Services
{
    public class ItemService : IItemService
    {
        private readonly ItemRepository _repo;

        public ItemService(ItemRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Item>> GetAllItemsAsync()
        {
            return await _repo.GetAllAsync();
        }
    }
}

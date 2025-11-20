using System.Collections.Generic;
using System.Threading.Tasks;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;
using SalesOrderApp.Infrastructure.Repositories;

namespace SalesOrderApp.Application.Services
{
    public class ClientService : IClientService
    {
        private readonly ClientRepository _repo;

        public ClientService(ClientRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Client>> GetAllClientsAsync()
        {
            return await _repo.GetAllAsync();
        }
    }
}

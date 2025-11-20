using System.Collections.Generic;

namespace SalesOrderApp.Domain.Entities
{
    public class Client
    {
        public int ClientId { get; set; }        
        public string Name { get; set; }          

        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string ContactNumber { get; set; }

      
        public ICollection<SalesOrder> SalesOrders { get; set; }
    }
}

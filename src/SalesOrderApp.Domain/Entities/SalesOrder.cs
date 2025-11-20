using System;
using System.Collections.Generic;

namespace SalesOrderApp.Domain.Entities
{
    public class SalesOrder
    {
        public int SalesOrderId { get; set; }      
        public string OrderNumber { get; set; }    

        public int ClientId { get; set; }          
        public Client Client { get; set; }         

        public DateTime OrderDate { get; set; }
        public string Notes { get; set; }

        // Lines
        public ICollection<SalesOrderLine> Lines { get; set; }
    }
}

using System;
using System.Collections.Generic;

namespace SalesOrderApp.Domain.Entities
{
    public class SalesOrder
    {
        public int SalesOrderId { get; set; }      // PK
        public string OrderNumber { get; set; }    // e.g. SO-0001

        public int ClientId { get; set; }          // FK
        public Client Client { get; set; }         // Nav property

        public DateTime OrderDate { get; set; }
        public string Notes { get; set; }

        // Lines
        public ICollection<SalesOrderLine> Lines { get; set; }
    }
}

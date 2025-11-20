namespace SalesOrderApp.Domain.Entities
{
    public class SalesOrderLine
    {
        public int SalesOrderLineId { get; set; }  // PK (or LineId)

        public int SalesOrderId { get; set; }      // FK to header
        public SalesOrder SalesOrder { get; set; }

        public int ItemId { get; set; }            // FK to Item
        public Item Item { get; set; }

        public decimal Quantity { get; set; }
        public decimal Price { get; set; }         // Unit price at order time
        public decimal TaxRate { get; set; }       // e.g. 15 for 15%

        // We’ll calculate Excl/Tax/Incl totals in DTO or service layer
    }
}

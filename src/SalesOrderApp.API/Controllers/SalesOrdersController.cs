using Microsoft.AspNetCore.Mvc;
using SalesOrderApp.API.Models;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;
using System.Linq;
using System.Threading.Tasks;

namespace SalesOrderApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SalesOrdersController : ControllerBase
    {
        private readonly ISalesOrderService _salesOrderService;

        public SalesOrdersController(ISalesOrderService salesOrderService)
        {
            _salesOrderService = salesOrderService;
        }

        // POST: api/salesorders
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSalesOrderDto? dto)
        {
            if (dto == null)
                return BadRequest("Request body is required.");

            if (dto.Lines == null || dto.Lines.Count == 0)
                return BadRequest("At least one order line is required.");

            var order = new SalesOrder
            {
                ClientId = dto.ClientId,
                OrderDate = dto.OrderDate,
                Notes = dto.Notes,
                Lines = dto.Lines.Select(l => new SalesOrderLine
                {
                    ItemId = l.ItemId,
                    Quantity = l.Quantity,
                    Price = l.Price,
                    TaxRate = l.TaxRate
                }).ToList()
            };

            var created = await _salesOrderService.CreateOrderAsync(order);

            return Ok(new
            {
                created.SalesOrderId,
                created.OrderNumber
            });
        }

        // GET: api/salesorders
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _salesOrderService.GetAllOrdersAsync();

            var result = orders.Select(o =>
            {
                decimal totalExcl = 0;
                decimal totalTax = 0;
                decimal totalIncl = 0;

                if (o.Lines != null)
                {
                    foreach (var line in o.Lines)
                    {
                        var excl = line.Quantity * line.Price;
                        var tax = excl * line.TaxRate / 100;
                        var incl = excl + tax;

                        totalExcl += excl;
                        totalTax += tax;
                        totalIncl += incl;
                    }
                }

                return new SalesOrderSummaryDto
                {
                    SalesOrderId = o.SalesOrderId,
                    OrderNumber = o.OrderNumber,
                    ClientName = o.Client?.Name ?? "",
                    OrderDate = o.OrderDate,
                    TotalExcl = totalExcl,
                    TotalTax = totalTax,
                    TotalIncl = totalIncl
                };
            });

            return Ok(result);
        }

        // GET: api/salesorders/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _salesOrderService.GetOrderByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            var dto = new SalesOrderDetailsDto
            {
                SalesOrderId = order.SalesOrderId,
                OrderNumber = order.OrderNumber,
                ClientId = order.ClientId,
                OrderDate = order.OrderDate,
                Notes = order.Notes,
                Lines = order.Lines?.Select(l => new SalesOrderLineDto
                {
                    ItemId = l.ItemId,
                    Quantity = l.Quantity,
                    Price = l.Price,
                    TaxRate = l.TaxRate,
                    Description = "" // optional, not needed for backend
                }).ToList() ?? new()
            };

            return Ok(dto);
        }

        // PUT: api/salesorders/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateSalesOrderDto? dto)
        {
            if (dto == null)
                return BadRequest("Request body is required.");

            if (dto.Lines == null || dto.Lines.Count == 0)
                return BadRequest("At least one order line is required.");

            var updatedOrder = new SalesOrder
            {
                ClientId = dto.ClientId,
                OrderDate = dto.OrderDate,
                Notes = dto.Notes,
                Lines = dto.Lines.Select(l => new SalesOrderLine
                {
                    ItemId = l.ItemId,
                    Quantity = l.Quantity,
                    Price = l.Price,
                    TaxRate = l.TaxRate
                }).ToList()
            };

            var result = await _salesOrderService.UpdateOrderAsync(id, updatedOrder);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                result.SalesOrderId,
                result.OrderNumber
            });
        }
    }
}

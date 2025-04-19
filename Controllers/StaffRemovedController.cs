using System.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffRemovedController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public StaffRemovedController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("AddRemoved")]
        public async Task<ActionResult> AddRemoved([FromBody] StaffRemoved removed)
        {
            string query = @"
                INSERT INTO deleted_user
                (Removed_Full_Name, Removed_Email, Remover_Full_Name, Remover_Email, Date_Removed)
                VALUES 
                (@Removed_Full_Name, @Removed_Email, @Remover_Full_Name, @Remover_Email, @Date_Removed)";

            string sqlDataSource = _configuration.GetConnectionString("RP_ParticipantAppConnection");

            using (SqlConnection sqlConnection = new SqlConnection(sqlDataSource))
            {
                await sqlConnection.OpenAsync();

                using (SqlCommand sqlCommand = new SqlCommand(query, sqlConnection))
                {
                    sqlCommand.Parameters.AddWithValue("@Removed_Full_Name", removed.Removed_Full_Name ?? (object)DBNull.Value);
                    sqlCommand.Parameters.AddWithValue("@Removed_Email", removed.Removed_Email ?? (object)DBNull.Value);
                    sqlCommand.Parameters.AddWithValue("@Remover_Full_Name", removed.Remover_Full_Name ?? (object)DBNull.Value);
                    sqlCommand.Parameters.AddWithValue("@Remover_Email", removed.Remover_Email ?? (object)DBNull.Value);
                    sqlCommand.Parameters.AddWithValue("@Date_Removed", removed.Date_Removed);

                    await sqlCommand.ExecuteNonQueryAsync();
                }
            }

            return Ok(new { message = "Staff removal logged successfully" });
        }
    }
}

using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using FluentEmail.Core;
using BCrypt.Net;
using System.Data;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<StaffController> _logger;
        private readonly IFluentEmail _fluentEmail;

        public StaffController(
            IConfiguration configuration,
            ILogger<StaffController> logger,
            IFluentEmail fluentEmail)
        {
            _configuration = configuration;
            _logger = logger;
            _fluentEmail = fluentEmail;
        }

        [HttpPost("add-staff")]
        public async Task<ActionResult> AddStaff([FromBody] Staff staff)
        {
            staff.Pass_Word = BCrypt.Net.BCrypt.HashPassword(staff.Pass_Word);

            string query = @"
                INSERT INTO rp_training_staff 
                (First_Name, Last_Name, Email, Telephone, RJ_Location, Position, Type_Of_User, Pass_Word, Date_Added, PasswordChanged)
                VALUES 
                (@First_Name, @Last_Name, @Email, @Telephone, @RJ_Location, @Position, @Type_Of_User, @Pass_Word, @Date_Added, @PasswordChanged)";

            string sqlDataSource = _configuration.GetConnectionString("RP_ParticipantAppConnection");

            using (SqlConnection sqlCon = new SqlConnection(sqlDataSource))
            {
                await sqlCon.OpenAsync();

                using (SqlCommand cmd = new SqlCommand(query, sqlCon))
                {
                    cmd.Parameters.AddWithValue("@First_Name", staff.First_Name);
                    cmd.Parameters.AddWithValue("@Last_Name", staff.Last_Name);
                    cmd.Parameters.AddWithValue("@Email", staff.Email);
                    cmd.Parameters.AddWithValue("@Telephone", staff.Telephone);
                    cmd.Parameters.AddWithValue("@RJ_Location", staff.RJ_Location);
                    cmd.Parameters.AddWithValue("@Position", staff.Position);
                    cmd.Parameters.AddWithValue("@Type_Of_User", staff.Type_Of_User);
                    cmd.Parameters.AddWithValue("@Pass_Word", staff.Pass_Word);
                    cmd.Parameters.AddWithValue("@Date_Added", DateTime.UtcNow);
                    cmd.Parameters.AddWithValue("@PasswordChanged", 1);

                    int result = await cmd.ExecuteNonQueryAsync();

                    return result > 0
                        ? Ok(new { message = "Staff added successfully." })
                        : BadRequest("Failed to add staff.");
                }
            }
        }

       
    
        [HttpGet("{email}")]
        [ActionName("GetStaffByEmail")]
        public async Task<ActionResult<Staff>> GetStaffByEmail(string email)
        {
            string query = @"
                SELECT First_Name, 
                       Last_Name, 
                       Email,
                       Telephone,
                       RJ_Location,
                       Position, 
                       Type_Of_User,
                       Pass_Word, 
                       Date_Added 
                FROM rp_training_staff WHERE Email = @Email";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("RP_ParticipantAppConnection");

            using (SqlConnection mycon = new SqlConnection(sqlDataSource))
            {
                await mycon.OpenAsync();
                using (SqlCommand myCommand = new SqlCommand(query, mycon))
                {
                    myCommand.Parameters.AddWithValue("@Email", email);

                    using (SqlDataReader myReader = (SqlDataReader)await myCommand.ExecuteReaderAsync())
                    {
                        table.Load(myReader);
                    }
                }
            }

            if (table.Rows.Count == 0)
            {
                return NotFound($"Staff with Email {email} not found.");
            }

            DataRow row = table.Rows[0];
            Staff staff = new Staff
            {
                First_Name = row["First_Name"].ToString(),
                Last_Name = row["Last_Name"].ToString(),
                Email = row["Email"].ToString(),
                Telephone = row["Telephone"].ToString(),
                RJ_Location = row["RJ_Location"].ToString(),
                Position = row["Position"].ToString(),
                Type_Of_User = row["Type_Of_User"].ToString(),
                Pass_Word = row["Pass_Word"].ToString(),
                Date_Added = (DateTime)(row["Date_Added"] != DBNull.Value ? Convert.ToDateTime(row["Date_Added"]) : (DateTime?)null)
            };

            return Ok(staff);
        }

        [HttpGet("StaffExists")]
        public async Task<IActionResult> CheckRequestExists([FromQuery] string email)
        {
            var sql = "SELECT COUNT(*) FROM rp_training_staff WHERE Email = @Email";

            using var connection = new SqlConnection(_configuration.GetConnectionString("RP_ParticipantAppConnection"));
            await connection.OpenAsync();
            using var cmd = new SqlCommand(sql, connection);
            cmd.Parameters.AddWithValue("@Email", email);

            var count = Convert.ToInt32(await cmd.ExecuteScalarAsync());

            return Ok(new { exists = count > 0 });
        }


        [HttpDelete("{email}")]
        [ActionName("DeleteStaff")]
        public async Task<IActionResult> DeleteStaff(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Invalid Email.");
            }

            string query = "DELETE FROM rp_training_staff WHERE Email = @Email";

            var parameter = new SqlParameter("@Email", email);

            int rowsAffected = 0;

            string sqlDataSource = _configuration.GetConnectionString("RP_ParticipantAppConnection");

            using (SqlConnection mycon = new SqlConnection(sqlDataSource))
            {
                await mycon.OpenAsync();
                using (SqlCommand myCommand = new SqlCommand(query, mycon))
                {
                    myCommand.Parameters.Add(parameter);
                    rowsAffected = await myCommand.ExecuteNonQueryAsync();
                }
            }

            if (rowsAffected > 0)
            {
                return NoContent();
            }
            else
            {
                return NotFound($"Staff with Email {email} not found.");
            }




        }
    }




    public class LoginRequest
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }

        public class ForgotPasswordRequest
        {
            public string Email { get; set; }
        }
    }

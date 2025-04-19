
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using RP_Training_Web_Application.Models;
using System.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public RequestController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private string GenerateRequestNumber(string typeOfRequest)
        {
            string typePrefix = typeOfRequest.Length >= 3 ? typeOfRequest.Substring(0, 3).ToUpper() : typeOfRequest.ToUpper();
            string uniqueSuffix = DateTime.UtcNow.ToString("yyyy-MM-dd_HH-mm-ss");
            return $"{typePrefix}-{uniqueSuffix}";
        }

        [HttpPost("AddRequest")]
        public async Task<ActionResult> AddRequest([FromBody] RequestLog request)
        {
            if (string.IsNullOrWhiteSpace(request.Type_Of_Request))
            {
                return BadRequest("Type_Of_Request is required to generate Request_Number.");
            }

            // Generate Request Number and set status
            request.Log_Number = GenerateRequestNumber(request.Type_Of_Request);
            request.Request_Status = "Pending";

            string query = @"
                INSERT INTO rp_request_log
                (Log_Number, Participant_ID, Type_Of_Request, Requester, Requester_Email, Requester_Comment, 
                 Date_Requested, Request_Status)
                VALUES 
                (@Log_Number, @Participant_ID, @Type_Of_Request, @Requester, @Requester_Email, @Requester_Comment, 
                 @Date_Requested, @Request_Status)";

            string sqlDataSource = _configuration.GetConnectionString("RP_ParticipantAppConnection");

            using (SqlConnection sqlConnection = new SqlConnection(sqlDataSource))
            {
                await sqlConnection.OpenAsync();

                using (SqlCommand sqlCommand = new SqlCommand(query, sqlConnection))
                {
                    sqlCommand.Parameters.AddWithValue("@Log_Number", request.Log_Number);
                    sqlCommand.Parameters.AddWithValue("@Participant_ID", request.Participant_ID ?? (object)DBNull.Value);
                    sqlCommand.Parameters.AddWithValue("@Type_Of_Request", request.Type_Of_Request);
                    sqlCommand.Parameters.AddWithValue("@Requester", request.Requester);
                    sqlCommand.Parameters.AddWithValue("@Requester_Email", request.Requester_Email);
                    sqlCommand.Parameters.AddWithValue("@Requester_Comment", request.Requester_Comment);
                    sqlCommand.Parameters.AddWithValue("@Date_Requested", request.Date_Requested);
                    sqlCommand.Parameters.AddWithValue("@Request_Status", request.Request_Status);

                    await sqlCommand.ExecuteNonQueryAsync();
                }
            }

            return Ok(new { message = "Request logged successfully", Log_Number = request.Log_Number, Request_Status = request.Request_Status });
        }





[HttpPut("Update/{logNumber}")]
        [ActionName("UpdateRequest")]
        public async Task<IActionResult> UpdateRequest(string logNumber, [FromBody] RequestLog UpdateRequest)
        {
            if (string.IsNullOrEmpty(logNumber) || UpdateRequest == null)
            {
                return BadRequest("Invalid input.");
            }

            UpdateRequest.Request_Status = "Resolved";

            // SQL query to update the participant record
            string query = @"
    UPDATE rp_request_log
    SET 
        Action_Taken = @Action_Taken,
        Responder = @Responder,
        Responder_Email = @Responder_Email,
        Responder_Comment = @Responder_Comment,
        Date_Responded = GETDATE(),
        Request_Status = @Request_Status
    WHERE Log_Number = @Log_Number";  // Update based on Log_Number

            // Set up the parameters for the query
            var parameters = new List<SqlParameter>
    {
        new SqlParameter("@Action_Taken", UpdateRequest.Action_Taken),
        new SqlParameter("@Responder", UpdateRequest.Responder),
        new SqlParameter("@Responder_Email", UpdateRequest.Responder_Email),
        new SqlParameter("@Responder_Comment", UpdateRequest.Responder_Comment),
        new SqlParameter("@Date_Responded", UpdateRequest.Date_Responded),
        new SqlParameter("@Request_Status", UpdateRequest.Request_Status),
        new SqlParameter("@Log_Number", logNumber)  // logNumber from the URL
    };

            // Execute the query and update the database
            int rowsAffected = 0;
            string sqlDataSource = _configuration.GetConnectionString("RP_ParticipantAppConnection");

            using (SqlConnection mycon = new SqlConnection(sqlDataSource))
            {
                await mycon.OpenAsync();
                using (SqlCommand myCommand = new SqlCommand(query, mycon))
                {
                    myCommand.Parameters.AddRange(parameters.ToArray());
                    rowsAffected = await myCommand.ExecuteNonQueryAsync();  // Execute the update
                }
            }

            // Check if any row was affected (i.e., if the update was successful)
            if (rowsAffected > 0)
            {
                return Ok(new { message = "PRequest updated successfully", logNumber = logNumber });
            }
            else
            {
                return NotFound("Log number not found or no changes made.");
            }
        }

        [HttpPut("denyRequest/{logNumber}")]
        [ActionName("denyRequest")]
        public async Task<IActionResult> denyRequest(string logNumber, [FromBody] RequestLog denyRequest)
        {
            if (string.IsNullOrEmpty(logNumber) || denyRequest == null)
            {
                return BadRequest("Invalid input.");
            }

            denyRequest.Request_Status = "Denied";

            // SQL query to update the participant record
            string query = @"
                UPDATE rp_request_log
                SET 
                    Action_Taken = @Action_Taken,
                    Responder = @Responder,
                    Responder_Email = @Responder_Email,
                    Responder_Comment = @Responder_Comment,
                    Date_Responded = GETDATE(),
                    Request_Status = @Request_Status
                WHERE Log_Number = @Log_Number";  // Update based on Log_Number

            // Set up the parameters for the query
            var parameters = new List<SqlParameter>
    {
        new SqlParameter("@Action_Taken", denyRequest.Action_Taken),
        new SqlParameter("@Responder", denyRequest.Responder),
        new SqlParameter("@Responder_Email", denyRequest.Responder_Email),
        new SqlParameter("@Responder_Comment", denyRequest.Responder_Comment),
        new SqlParameter("@Date_Responded", denyRequest.Date_Responded),
        new SqlParameter("@Request_Status", denyRequest.Request_Status),
        new SqlParameter("@Log_Number", logNumber)  // logNumber from the URL
    };

            // Execute the query and update the database
            int rowsAffected = 0;
            string sqlDataSource = _configuration.GetConnectionString("RP_ParticipantAppConnection");

            using (SqlConnection mycon = new SqlConnection(sqlDataSource))
            {
                await mycon.OpenAsync();
                using (SqlCommand myCommand = new SqlCommand(query, mycon))
                {
                    myCommand.Parameters.AddRange(parameters.ToArray());
                    rowsAffected = await myCommand.ExecuteNonQueryAsync();  // Execute the update
                }
            }

            // Check if any row was affected (i.e., if the update was successful)
            if (rowsAffected > 0)
            {
                return Ok(new { message = "Request denied successfully", logNumber = logNumber });
            }
            else
            {
                return NotFound("Log number not found or no changes made.");
            }
        }

        [HttpGet("PendingRequests")]
        public async Task<ActionResult<IEnumerable<RequestLog>>> GetRequestLogs()
        {
            string query = @"
        SELECT 
            Log_Number, Participant_ID, Type_Of_Request, Requester, Requester_Email, Requester_Comment, 
            Date_Requested, Request_Status
        FROM rp_request_log
        WHERE Request_Status = 'Pending'"; // ✅ Filter for only pending requests

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("RP_ParticipantAppConnection");

            using (SqlConnection mycon = new SqlConnection(sqlDataSource))
            {
                await mycon.OpenAsync();
                using (SqlCommand myCommand = new SqlCommand(query, mycon))
                {
                    using (SqlDataReader myReader = (SqlDataReader)await myCommand.ExecuteReaderAsync())
                    {
                        table.Load(myReader);
                    }
                }
            }

            List<RequestLog> requestLogs = new List<RequestLog>();

            foreach (DataRow row in table.Rows)
            {
                requestLogs.Add(new RequestLog
                {
                    Log_Number = row["Log_Number"].ToString(),
                    Participant_ID = row["Participant_ID"].ToString(),
                    Type_Of_Request = row["Type_Of_Request"].ToString(),
                    Requester = row["Requester"].ToString(),
                    Requester_Email = row["Requester_Email"].ToString(),
                    Requester_Comment = row["Requester_Comment"].ToString(),
                    Date_Requested = row["Date_Requested"].ToString(),
                    Request_Status = row["Request_Status"].ToString(),
                });
            }

            return Ok(requestLogs);

        }


        [HttpGet("IndividualRequests")]
        public async Task<ActionResult<IEnumerable<RequestLog>>> GetMyRequestLogs([FromQuery] string requesterEmail)
        {
            if (string.IsNullOrEmpty(requesterEmail))
            {
                return BadRequest("Missing requester.");
            }

            string query = @"
        SELECT 
            Log_Number, Participant_ID, Type_Of_Request, Requester, Requester_Email, Requester_Comment, 
            Date_Requested, Action_Taken, Responder, Responder_Email, Responder_Comment, Date_Responded, Request_Status
        FROM rp_request_log
        WHERE Requester_Email = @Requester_Email";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("RP_ParticipantAppConnection");

            using (SqlConnection mycon = new SqlConnection(sqlDataSource))
            {
                await mycon.OpenAsync();
                using (SqlCommand myCommand = new SqlCommand(query, mycon))
                {
                    myCommand.Parameters.AddWithValue("@Requester_Email", requesterEmail); // ✅ Add the missing parameter

                    using (SqlDataReader myReader = (SqlDataReader)await myCommand.ExecuteReaderAsync())
                    {
                        table.Load(myReader);
                    }
                }
            }

            List<RequestLog> requestLogs = new List<RequestLog>();

            foreach (DataRow row in table.Rows)
            {
                requestLogs.Add(new RequestLog
                {
                    Log_Number = row["Log_Number"].ToString(),
                    Participant_ID = row["Participant_ID"].ToString(),
                    Type_Of_Request = row["Type_Of_Request"].ToString(),
                    Requester = row["Requester"].ToString(),
                    Requester_Email = row["Requester_Email"].ToString(),
                    Requester_Comment = row["Requester_Comment"].ToString(),
                    Date_Requested = row["Date_Requested"].ToString(),
                    Action_Taken = row["Action_Taken"].ToString(),
                    Responder = row["Responder"].ToString(),
                    Responder_Email = row["Responder_Email"].ToString(),
                    Responder_Comment = row["Responder_Comment"].ToString(),
                    Date_Responded = row["Date_Responded"].ToString(),
                    Request_Status = row["Request_Status"].ToString(),
                });
            }

            return Ok(requestLogs);
        }

        [HttpGet("Exists")]
        public async Task<IActionResult> CheckRequestExists([FromQuery] string participantId)
        {
            var sql = "SELECT COUNT(*) FROM rp_request_log WHERE Participant_ID = @ParticipantID";

            using var connection = new SqlConnection(_configuration.GetConnectionString("RP_ParticipantAppConnection"));
            await connection.OpenAsync();
            using var cmd = new SqlCommand(sql, connection);
            cmd.Parameters.AddWithValue("@ParticipantID", participantId);

            var count = Convert.ToInt32(await cmd.ExecuteScalarAsync());

            return Ok(new { exists = count > 0 });
        }




    }


}


using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DropDownsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private object? genders;
        private object? modalities;
        private object? rjCentreLocations;
        private object? typeOfRequests;
        private object? staffPositions;
        private object? typeOfUsers;

        public DropDownsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Get list of Parishes (sorted)
        [HttpGet("parishes")]
        public async Task<IActionResult> GetParishes()
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("RP_ParticipantAppConnection");

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    await conn.OpenAsync();

                    var command = new SqlCommand("SELECT DISTINCT Parishes FROM dropdown_lists WHERE Parishes IS NOT NULL ORDER BY Parishes ASC", conn);
                    var reader = await command.ExecuteReaderAsync();

                    var parishes = new List<string>();
                    while (await reader.ReadAsync())
                    {
                        parishes.Add(reader.GetString(0));
                    }

                    return Ok(parishes);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // Get list of Communities for a selected Parish (sorted)
        [HttpGet("communities")]
        public async Task<IActionResult> GetCommunities([FromQuery] string parish)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(parish))
                {
                    return BadRequest(new { error = "Parish is required." });
                }

                // Map parish name to corresponding column
                var parishColumnMap = new Dictionary<string, string>
                {
                    { "Kingston", "Kingston_Communities" },
                    { "St. Andrew", "St_Andrew_Communities" },
                    { "Westmoreland", "Westmoreland_Communities" },
                    { "St. Mary", "St_Mary_Communities" },
                    { "St. James", "St_James_Communities" },
                    { "St. Catherine", "St_Catherine_Communities" },
                    { "Hanover", "Hanover_Communities" },
                    { "Clarendon", "Clarendon_Communities" },
                    { "St. Thomas", "St_Thomas_Communities" },
                    { "Manchester", "Manchester_Communities" },
                    { "Trelawny", "Trelawny_Communities" },
                    { "St. Ann", "St_Ann_Communities" },
                    { "St. Elizabeth", "St_Elizabeth_Communities" },
                    { "Portland", "Portland_Communities" }
                };

                if (!parishColumnMap.TryGetValue(parish, out string columnName))
                {
                    return BadRequest(new { error = "Invalid parish name." });
                }

                var connectionString = _configuration.GetConnectionString("RP_ParticipantAppConnection");

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    await conn.OpenAsync();

                    string query = $"SELECT DISTINCT [{columnName}] FROM dropdown_lists WHERE [{columnName}] IS NOT NULL ORDER BY [{columnName}] ASC";
                    var command = new SqlCommand(query, conn);
                    var reader = await command.ExecuteReaderAsync();

                    var communities = new List<string>();
                    while (await reader.ReadAsync())
                    {
                        communities.Add(reader.GetString(0));
                    }

                    return Ok(communities);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }


        [HttpGet("institutions")]
        public async Task<IActionResult> GetInstitutions()
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("RP_ParticipantAppConnection");

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    await conn.OpenAsync();

                    var command = new SqlCommand("SELECT DISTINCT Institutions FROM dropdown_lists WHERE Institutions IS NOT NULL ORDER BY Institutions ASC", conn);
                    var reader = await command.ExecuteReaderAsync();

                    var parishes = new List<string>();
                    while (await reader.ReadAsync())
                    {
                        parishes.Add(reader.GetString(0));
                    }

                    return Ok(parishes);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("institutionNames")]
        public async Task<IActionResult> GetInstitutionNames([FromQuery] string institution)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(institution))
                {
                    return BadRequest(new { error = "Type of institution is required." });
                }

                // Map parish name to corresponding column
                var parishColumnMap = new Dictionary<string, string>
                {

                    { "Police", "Police_Stations"},
                    { "School", "School" },
                    { "Community", "Communities" }

                   
                };

                if (!parishColumnMap.TryGetValue(institution, out string columnName))
                {
                    return BadRequest(new { error = "Invalid institution name." });
                }

                var connectionString = _configuration.GetConnectionString("RP_ParticipantAppConnection");

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    await conn.OpenAsync();

                    string query = $"SELECT DISTINCT [{columnName}] FROM dropdown_lists WHERE [{columnName}] IS NOT NULL ORDER BY [{columnName}] ASC";
                    var command = new SqlCommand(query, conn);
                    var reader = await command.ExecuteReaderAsync();

                    var institutionNames = new List<string>();
                    while (await reader.ReadAsync())
                    {
                        institutionNames.Add(reader.GetString(0));
                    }

                    return Ok(institutionNames);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("participantPositions")]
        public async Task<IActionResult> GetParticipantPositions([FromQuery] string institution)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(institution))
                {
                    return BadRequest(new { error = "Type of institution is required." });
                }

                // Map parish name to corresponding column
                var parishColumnMap = new Dictionary<string, string>
                {

                    { "Church", "Church_Positions" },
                    {"Police", "Police_Ranks"},
                    { "DCS", "DCS_Positions"},
                    { "School", "School_Positions" },
                    { "Community", "Community_Positions" },


                };

                if (!parishColumnMap.TryGetValue(institution, out string columnName))
                {
                    return BadRequest(new { error = "Invalid institution name." });
                }

                var connectionString = _configuration.GetConnectionString("RP_ParticipantAppConnection");

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    await conn.OpenAsync();

                    string query = $"SELECT DISTINCT [{columnName}] FROM dropdown_lists WHERE [{columnName}] IS NOT NULL ORDER BY [{columnName}] ASC";
                    var command = new SqlCommand(query, conn);
                    var reader = await command.ExecuteReaderAsync();

                    var institutionNames = new List<string>();
                    while (await reader.ReadAsync())
                    {
                        institutionNames.Add(reader.GetString(0));
                    }

                    return Ok(institutionNames);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("genders")]
        public async Task<IActionResult> GetGenders()
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("RP_ParticipantAppConnection");

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    await conn.OpenAsync();

                    var command = new SqlCommand("SELECT DISTINCT Sex FROM dropdown_lists WHERE Sex IS NOT NULL ORDER BY Sex ASC", conn);
                    var reader = await command.ExecuteReaderAsync();

                    var genders = new List<string>();  // Correct name here
                    while (await reader.ReadAsync())
                    {
                        genders.Add(reader.GetString(0));  // Add to genders list
                    }

                    return Ok(genders);  // Return the correct list
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }


        [HttpGet("modalities")]
        public async Task<IActionResult> GetModalities()
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("RP_ParticipantAppConnection");

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    await conn.OpenAsync();

                    var command = new SqlCommand("SELECT DISTINCT Session_Modality FROM dropdown_lists WHERE Session_Modality IS NOT NULL ORDER BY Session_Modality ASC", conn);
                    var reader = await command.ExecuteReaderAsync();

                    var modalities = new List<string>();
                    while (await reader.ReadAsync())
                    {
                        modalities.Add(reader.GetString(0));
                    }

                    return Ok(modalities);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("rjCentreLocations")]
        public async Task<IActionResult> GetRjCentreLocations()
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("RP_ParticipantAppConnection");

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    await conn.OpenAsync();

                    var command = new SqlCommand("SELECT DISTINCT RJ_Centre_Location FROM dropdown_lists WHERE RJ_Centre_Location IS NOT NULL ORDER BY RJ_Centre_Location ASC", conn);
                    var reader = await command.ExecuteReaderAsync();

                    var rjCentreLocations = new List<string>();
                    while (await reader.ReadAsync())
                    {
                        rjCentreLocations.Add(reader.GetString(0));
                    }

                    return Ok(rjCentreLocations);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("typeOfRequests")]
        public async Task<IActionResult> GetTypeOfRequests()
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("RP_ParticipantAppConnection");

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    await conn.OpenAsync();

                    var command = new SqlCommand("SELECT DISTINCT Type_Of_Request FROM dropdown_lists WHERE Type_Of_Request IS NOT NULL ORDER BY Type_Of_Request ASC", conn);
                    var reader = await command.ExecuteReaderAsync();

                    var typeOfRequests = new List<string>();
                    while (await reader.ReadAsync())
                    {
                        typeOfRequests.Add(reader.GetString(0));
                    }

                    return Ok(typeOfRequests);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("staffPositions")]
        public async Task<IActionResult> GetStaffPositions()
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("RP_ParticipantAppConnection");

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    await conn.OpenAsync();

                    var command = new SqlCommand("SELECT DISTINCT Staff_Position FROM dropdown_lists WHERE Staff_Position IS NOT NULL ORDER BY Staff_Position ASC", conn);
                    var reader = await command.ExecuteReaderAsync();

                    var staffPositions = new List<string>();
                    while (await reader.ReadAsync())
                    {
                        staffPositions.Add(reader.GetString(0));
                    }

                    return Ok(staffPositions);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("typeOfUsers")]
        public async Task<IActionResult> GetTypeOfUsers()
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("RP_ParticipantAppConnection");

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    await conn.OpenAsync();

                    var command = new SqlCommand("SELECT DISTINCT Type_Of_User FROM dropdown_lists WHERE Type_Of_User IS NOT NULL ORDER BY Type_Of_User ASC", conn);
                    var reader = await command.ExecuteReaderAsync();

                    var typeOfUsers = new List<string>();
                    while (await reader.ReadAsync())
                    {
                        typeOfUsers.Add(reader.GetString(0));
                    }

                    return Ok(typeOfUsers);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

    }
}

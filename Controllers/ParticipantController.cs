using System.Data;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;  // Use Microsoft.Data.SqlClient
using RP_Training_Web_Application.Models;



namespace WebApplication1.Controllers
    {
        [Route("api/[controller]")]
        [ApiController]
        public class ParticipantController : ControllerBase
        {
            private readonly IConfiguration _configuration;

        public object RP_ParticipantAppConnection { get; private set; }

        public ParticipantController(IConfiguration configuration)
            {
                _configuration = configuration;
            }


        private async Task<string> GenerateParticipantIDFromDatabaseAsync()
        {
            string sqlDataSource = _configuration.GetConnectionString("RP_ParticipantAppConnection");

            using (SqlConnection sqlCon = new SqlConnection(sqlDataSource))
            {
                await sqlCon.OpenAsync();

                int nextNum = 0;

                // Fetch the current number
                string selectQuery = "SELECT TOP 1 ID_Num FROM consecutive_num WHERE Data_Set = 'RP_Training';";
                using (SqlCommand selectCommand = new SqlCommand(selectQuery, sqlCon))
                {
                    var result = await selectCommand.ExecuteScalarAsync();

                    if (result == null || result == DBNull.Value)
                    {
                        throw new Exception("No ID_Num found in consecutive_num table for RP_Training.");
                    }

                    nextNum = Convert.ToInt32(result);
                }

                // Update the number for next use
                string updateQuery = "UPDATE consecutive_num SET ID_Num = @NewNum WHERE Data_Set = 'RP_Training';";
                using (SqlCommand updateCommand = new SqlCommand(updateQuery, sqlCon))
                {
                    updateCommand.Parameters.AddWithValue("@NewNum", nextNum + 1);
                    await updateCommand.ExecuteNonQueryAsync();
                }

                // Format as string with leading zeros if you like
                return nextNum.ToString("D5");  // Example: 00001, 00002, etc.
            }
        }





        // Method to generate a training number
        private string GenerateTrainingNumber(string typeOfInstitution, string nameOfInstitution, DateOnly trainingDate)
            {
                string typePrefix = typeOfInstitution.Length >= 3 ? typeOfInstitution.Substring(0, 3).ToUpper() : typeOfInstitution.ToUpper();
                string namePrefix = nameOfInstitution.Length >= 3 ? nameOfInstitution.Substring(0, 3).ToUpper() : nameOfInstitution.ToUpper();
                string uniqueSuffix = trainingDate.ToString("yyyy-MM-dd");
                return $"{typePrefix}{namePrefix}_{uniqueSuffix}";
            }


            // Method to calculate the age of a participant based on their date of birth
            private int CalculateAge(DateOnly birthDate)
            {
                var today = DateOnly.FromDateTime(DateTime.Now); // Get today's date
                int age = today.Year - birthDate.Year; // Subtract the birth year from current year

                // Adjust for whether the birthday has already occurred this year
                if (today < birthDate.AddYears(age))
                {
                    age--; // Subtract 1 if the birthday hasn't occurred yet
                }

                return age;
            }

            private string DetermineAgeGroup(int age)
            {
                if (age < 18)
                    return "Child";
                else if (age >= 18 && age < 65)
                    return "Adult";
                else
                    return "Senior";
            }


            [HttpPost("AddParticipant")]
            public async Task<ActionResult> AddParticipant([FromBody] Participant participant)
            {

            // Prepare the SQL query to insert the new staff into the database
            string query = @"
                INSERT INTO rp_participants 
                    (Training_Day_1, Training_Day_2, Modality, Type_of_Institution, Name_of_Institution, 
                     Institution_Parish, Institution_Community, Participant_First_Name, Participant_Last_Name, 
                     Participant_Gender, Date_Of_Birth, Age, Age_Group, Street_Num_Name, Locality,
                     Participant_Parish, Participant_Community, Participant_Position, 
                     Participant_Telephone, Participant_Email, RJ_Centre, Training_Instructor_1, Training_Instructor_2,
                     Training_Number, Participants_ID, Certified, Last_Edit, Submitted_By)
                VALUES 
                    (@Training_Day_1, @Training_Day_2, @Modality, @Type_of_Institution, @Name_of_Institution, 
                     @Institution_Parish, @Institution_Community, @Participant_First_Name, @Participant_Last_Name, 
                     @Participant_Gender, @Date_Of_Birth, @Age, @Age_Group, @Street_Num_Name, @Locality,
                     @Participant_Parish, @Participant_Community, @Participant_Position, 
                     @Participant_Telephone, @Participant_Email, @RJ_Centre, @Training_Instructor_1, 
                     @Training_Instructor_2, @Training_Number, @Participants_ID, @Certified, @Last_Edit, @Submitted_By);
                ";


            // Set up the connection and command
            string sqlDataSource = _configuration.GetConnectionString("RP_ParticipantAppConnection");
            


            using (SqlConnection mycon = new SqlConnection(sqlDataSource))
                {
                    await mycon.OpenAsync();

                    using (SqlCommand myCommand = new SqlCommand(query, mycon))
                    {

                       // participant.Participants_ID = await GenerateParticipantIDFromDatabaseAsync();

                   
                    participant.Participants_ID = $"ID_{await GenerateParticipantIDFromDatabaseAsync()}";

                    if (participant.Training_Day_1 == null)
                        {
                            return BadRequest("Training Day 1 is required to generate Training Number.");
                        }
                        participant.Training_Number = GenerateTrainingNumber(
                            participant.Type_of_Institution,
                            participant.Name_of_Institution,
                            participant.Training_Day_1.Value
                        );


                        // participant.Training_Number = GenerateTrainingNumber(participant.Type_of_Institution, participant.Name_of_Institution, participant.Training_Day_1);
                        participant.Age = CalculateAge(participant.Date_Of_Birth);
                        participant.Age_Group = DetermineAgeGroup(participant.Age.Value);

                        // Add parameters to the SQL query

                        myCommand.Parameters.AddWithValue("@Training_Day_1", participant.Training_Day_1?.ToString("yyyy-MM-dd") ?? (object)DBNull.Value);

                        myCommand.Parameters.AddWithValue("@Training_Day_2", participant.Training_Day_2?.ToString("yyyy-MM-dd"));

                        // myCommand.Parameters.AddWithValue("@Training_Day_1", participant.Training_Day_1);
                        // myCommand.Parameters.AddWithValue("@Training_Day_2", participant.Training_Day_2);
                        myCommand.Parameters.AddWithValue("@Modality", participant.Modality);
                        myCommand.Parameters.AddWithValue("@Type_of_Institution", participant.Type_of_Institution);
                        myCommand.Parameters.AddWithValue("@Name_of_Institution", participant.Name_of_Institution);
                        myCommand.Parameters.AddWithValue("@Institution_Parish", participant.Institution_Parish);
                        myCommand.Parameters.AddWithValue("@Institution_Community", participant.Institution_Community);
                        myCommand.Parameters.AddWithValue("@Participant_First_Name", participant.Participant_First_Name);
                        myCommand.Parameters.AddWithValue("@Participant_Last_Name", participant.Participant_Last_Name);
                        myCommand.Parameters.AddWithValue("@Participant_Gender", participant.Participant_Gender);
                        myCommand.Parameters.AddWithValue("@Date_Of_Birth", participant.Date_Of_Birth.ToString("yyyy-MM-dd"));
                        myCommand.Parameters.AddWithValue("@Age", participant.Age);
                        myCommand.Parameters.AddWithValue("@Age_Group", participant.Age_Group);
                        myCommand.Parameters.AddWithValue("@Street_Num_Name", participant.Street_Num_Name);
                        myCommand.Parameters.AddWithValue("@Locality", participant.Locality);
                        myCommand.Parameters.AddWithValue("@Participant_Parish", participant.Participant_Parish);
                        myCommand.Parameters.AddWithValue("@Participant_Community", participant.Participant_Community);
                        myCommand.Parameters.AddWithValue("@Participant_Position", participant.Participant_Position);
                        myCommand.Parameters.AddWithValue("@Participant_Telephone", participant.Participant_Telephone);
                        myCommand.Parameters.AddWithValue("@Participant_Email", participant.Participant_Email);
                        myCommand.Parameters.AddWithValue("@RJ_Centre", participant.RJ_Centre);
                        myCommand.Parameters.AddWithValue("@Training_Instructor_1", participant.Training_Instructor_1);
                        myCommand.Parameters.AddWithValue("@Training_Instructor_2", participant.Training_Instructor_2);
                        myCommand.Parameters.AddWithValue("@Training_Number", participant.Training_Number);
                        myCommand.Parameters.AddWithValue("@Participants_ID", participant.Participants_ID);
                        myCommand.Parameters.AddWithValue("@Certified", participant.Certified);
                        myCommand.Parameters.AddWithValue("@Last_Edit", DateTime.UtcNow); // Use UTC for consistency
                        myCommand.Parameters.AddWithValue("@Submitted_By", participant.Submitted_By);
                    
                        // Execute the insert command
                        int result = await myCommand.ExecuteNonQueryAsync();

                        // Check if any rows were affected
                        if (result > 0)
                        {
                            return Ok(new { message = "Participant added successfully." });
                        }
                        else
                        {
                            return BadRequest("Failed to add participant.");
                        }
                    }
                }
            }

            /*       private int? CalculateAge(DateOnly? date_Of_Birth)
                   {
                       throw new NotImplementedException();
                   }*/

            [HttpGet]
            public async Task<ActionResult<IEnumerable<Participant>>> GetParticipants()
            {
                string query = @"
        SELECT Training_Day_1, Training_Day_2, Modality, Type_of_Institution, Name_of_Institution, 
               Institution_Parish, Institution_Community, Participant_First_Name, Participant_Last_Name, 
               Participant_Gender, Date_Of_Birth, Age, Age_Group, Street_Num_Name, Locality,
               Participant_Parish, Participant_Community, Participant_Position, 
               Participant_Telephone, Participant_Email, RJ_Centre, Training_Instructor_1, Training_Instructor_2,
               Training_Number, Participants_ID, Certified, Last_Edit, Submitted_By
        FROM rp_participants";
           
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

                // Convert DataTable to List of Participants
                List<Participant> participants = new List<Participant>();

                foreach (DataRow row in table.Rows)
                {
                    participants.Add(new Participant
                    {
                        Training_Day_1 = row["Training_Day_1"] != DBNull.Value ? DateOnly.FromDateTime(Convert.ToDateTime(row["Training_Day_1"])) : (DateOnly?)null,
                        Training_Day_2 = row["Training_Day_2"] != DBNull.Value ? DateOnly.FromDateTime(Convert.ToDateTime(row["Training_Day_2"])) : (DateOnly?)null,
                        Modality = row["Modality"].ToString(),
                        Type_of_Institution = row["Type_of_Institution"].ToString(),
                        Name_of_Institution = row["Name_of_Institution"].ToString(),
                        Institution_Parish = row["Institution_Parish"].ToString(),
                        Institution_Community = row["Institution_Community"].ToString(),
                        Participant_First_Name = row["Participant_First_Name"].ToString(),
                        Participant_Last_Name = row["Participant_Last_Name"].ToString(),
                        Participant_Gender = row["Participant_Gender"].ToString(),


                        Date_Of_Birth = row["Date_Of_Birth"] != DBNull.Value
                        ? DateOnly.FromDateTime(Convert.ToDateTime(row["Date_Of_Birth"]))
                        : default(DateOnly),



                        Age = row["Age"] != DBNull.Value ? Convert.ToInt32(row["Age"]) : 0,  // Handle DBNull for Age
                        Age_Group = row["Age_Group"].ToString(),
                        Street_Num_Name = row["Street_Num_Name"].ToString(),
                        Locality = row["Locality"].ToString(),
                        Participant_Parish = row["Participant_Parish"].ToString(),
                        Participant_Community = row["Participant_Community"].ToString(),
                        Participant_Position = row["Participant_Position"].ToString(),
                        Participant_Telephone = row["Participant_Telephone"].ToString(),
                        Participant_Email = row["Participant_Email"].ToString(),
                        RJ_Centre = row["RJ_Centre"].ToString(),
                        Training_Instructor_1 = row["Training_Instructor_1"].ToString(),
                        Training_Instructor_2 = row["Training_Instructor_2"].ToString(),
                        Training_Number = row["Training_Number"].ToString(),
                        Participants_ID = row["Participants_ID"].ToString(),
                        Certified = row["Certified"].ToString(),
                        Last_Edit = row["Last_Edit"] != DBNull.Value ? Convert.ToDateTime(row["Last_Edit"]) : (DateTime?)null,
                        Submitted_By = row["Submitted_By"].ToString(),
                    });

                }

                return Ok(participants);
            }


            [HttpGet("{id}")] // Accepts Participant_ID as a route parameter
            [ActionName("GetParticipantById")]
            public async Task<ActionResult<Participant>> GetParticipantById(string id)
            {
            string query = @"
                    SELECT Training_Day_1, Training_Day_2, Modality, Type_of_Institution, Name_of_Institution, 
                        Institution_Parish, Institution_Community, Participant_First_Name, Participant_Last_Name, 
                        Participant_Gender, Date_Of_Birth, Age, Age_Group, Street_Num_Name, Locality,
                        Participant_Parish, Participant_Community, Participant_Position, 
                        Participant_Telephone, Participant_Email, RJ_Centre, Training_Instructor_1, Training_Instructor_2,
                        Training_Number, Participants_ID, Certified, Last_Edit, Submitted_By
                    FROM rp_participants 
                    WHERE Participants_ID = @Participant_ID";


            DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("RP_ParticipantAppConnection");

                using (SqlConnection mycon = new SqlConnection(sqlDataSource))
                {
                    await mycon.OpenAsync();
                    using (SqlCommand myCommand = new SqlCommand(query, mycon))
                    {
                        myCommand.Parameters.AddWithValue("@Participant_ID", id); // ✅ Prevents SQL Injection

                        using (SqlDataReader myReader = (SqlDataReader)await myCommand.ExecuteReaderAsync())
                        {
                            table.Load(myReader);
                        }
                    }
                }

                if (table.Rows.Count == 0)
                {
                    return NotFound($"Participant with ID {id} not found."); // ✅ Return 404 if no participant found
                }

                // Convert DataTable to Participant object
                DataRow row = table.Rows[0];
                Participant participant = new Participant
                {
                    Training_Day_1 = row["Training_Day_1"] != DBNull.Value ? DateOnly.FromDateTime(Convert.ToDateTime(row["Training_Day_1"])) : default,
                    Training_Day_2 = row["Training_Day_2"] != DBNull.Value ? DateOnly.FromDateTime(Convert.ToDateTime(row["Training_Day_2"])) : default,
                    Modality = row["Modality"].ToString(),
                    Type_of_Institution = row["Type_of_Institution"].ToString(),
                    Name_of_Institution = row["Name_of_Institution"].ToString(),
                    Institution_Parish = row["Institution_Parish"].ToString(),
                    Institution_Community = row["Institution_Community"].ToString(),
                    Participant_First_Name = row["Participant_First_Name"].ToString(),
                    Participant_Last_Name = row["Participant_Last_Name"].ToString(),
                    Participant_Gender = row["Participant_Gender"].ToString(),

                    Date_Of_Birth = row["Date_Of_Birth"] != DBNull.Value
                    ? DateOnly.FromDateTime(Convert.ToDateTime(row["Date_Of_Birth"]))
                    : default(DateOnly),

                    Age = row["Age"] != DBNull.Value ? Convert.ToInt32(row["Age"]) : 0,  // Handle DBNull for Age
                    Age_Group = row["Age_Group"].ToString(),
                    Street_Num_Name = row["Street_Num_Name"].ToString(),
                    Locality = row["Locality"].ToString(),
                    Participant_Parish = row["Participant_Parish"].ToString(),
                    Participant_Community = row["Participant_Community"].ToString(),
                    Participant_Position = row["Participant_Position"].ToString(),
                    Participant_Telephone = row["Participant_Telephone"].ToString(),
                    Participant_Email = row["Participant_Email"].ToString(),
                    RJ_Centre = row["RJ_Centre"].ToString(),
                    Training_Instructor_1 = row["Training_Instructor_1"].ToString(),
                    Training_Instructor_2 = row["Training_Instructor_2"].ToString(),
                    Training_Number = row["Training_Number"].ToString(),
                    Participants_ID = row["Participants_ID"].ToString(),
                    Certified = row["Certified"].ToString(),
                    Last_Edit = row["Last_Edit"] != DBNull.Value ? Convert.ToDateTime(row["Last_Edit"]) : (DateTime?)null,
                    Submitted_By = row["Submitted_By"].ToString()
                };

                return Ok(participant);
            }





            [HttpGet("Search")]
            public async Task<ActionResult<IEnumerable<Participant>>> SearchParticipants(
         [FromQuery] string? iDNumber,
         [FromQuery] string? trainingNumber,
         [FromQuery] string? firstName,
         [FromQuery] string? lastName,
         [FromQuery] string? telephone)

            {
                var participants = new List<Participant>();
                var sqlDataSource = _configuration.GetConnectionString("RP_ParticipantAppConnection");

                using (var mycon = new SqlConnection(sqlDataSource))
                {
                    await mycon.OpenAsync();

                    var queryBuilder = new StringBuilder("SELECT * FROM rp_participants");

                    bool hasAnyFilter = !string.IsNullOrWhiteSpace(iDNumber) ||
                                        !string.IsNullOrWhiteSpace(trainingNumber) ||
                                        !string.IsNullOrWhiteSpace(firstName) ||
                                        !string.IsNullOrWhiteSpace(lastName) ||
                                        !string.IsNullOrWhiteSpace(telephone);


                    if (hasAnyFilter)
                    {
                        queryBuilder.Append(" WHERE ");

                        var conditions = new List<string>();

                        if (!string.IsNullOrWhiteSpace(iDNumber))
                            conditions.Add("Participants_ID = @IdNumber");

                        if (!string.IsNullOrWhiteSpace(trainingNumber))
                            conditions.Add("Training_Number = @TrainingNumber");

                        if (!string.IsNullOrWhiteSpace(firstName))
                            conditions.Add("Participant_First_Name LIKE @FirstName");

                        if (!string.IsNullOrWhiteSpace(lastName))
                            conditions.Add("Participant_Last_Name LIKE @LastName");

                        if (!string.IsNullOrWhiteSpace(telephone))
                            conditions.Add("Participant_Telephone = @Telephone");





                        queryBuilder.Append(string.Join(" OR ", conditions));
                    }

                    using (var cmd = new SqlCommand(queryBuilder.ToString(), mycon))
                    {
                        if (!string.IsNullOrWhiteSpace(iDNumber))
                            cmd.Parameters.AddWithValue("@IdNumber", iDNumber);

                        if (!string.IsNullOrWhiteSpace(trainingNumber))
                            cmd.Parameters.AddWithValue("@TrainingNumber", trainingNumber);

                        if (!string.IsNullOrWhiteSpace(firstName))
                            cmd.Parameters.AddWithValue("@FirstName", $"%{firstName}%");

                        if (!string.IsNullOrWhiteSpace(lastName))
                            cmd.Parameters.AddWithValue("@LastName", $"%{lastName}%");

                        if (!string.IsNullOrWhiteSpace(telephone))
                            cmd.Parameters.AddWithValue("@Telephone", telephone);





                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                participants.Add(new Participant
                                {


                                    Training_Day_1 = reader["Training_Day_1"] != DBNull.Value ? DateOnly.FromDateTime(Convert.ToDateTime(reader["Training_Day_1"])) : default,
                                    Training_Day_2 = reader["Training_Day_2"] != DBNull.Value ? DateOnly.FromDateTime(Convert.ToDateTime(reader["Training_Day_2"])) : default,
                                    Modality = reader["Modality"].ToString(),
                                    Type_of_Institution = reader["Type_of_Institution"].ToString(),
                                    Name_of_Institution = reader["Name_of_Institution"].ToString(),
                                    Institution_Parish = reader["Institution_Parish"].ToString(),
                                    Institution_Community = reader["Institution_Community"].ToString(),
                                    Participant_First_Name = reader["Participant_First_Name"].ToString(),
                                    Participant_Last_Name = reader["Participant_Last_Name"].ToString(),
                                    Participant_Gender = reader["Participant_Gender"].ToString(),

                                    Date_Of_Birth = reader["Date_Of_Birth"] != DBNull.Value
                                    ? DateOnly.FromDateTime(Convert.ToDateTime(reader["Date_Of_Birth"]))
                                    : default(DateOnly),


                                    Age = reader["Age"] != DBNull.Value ? Convert.ToInt32(reader["Age"]) : 0,  // Handle DBNull for Age
                                    Age_Group = reader["Age_Group"].ToString(),
                                    Street_Num_Name = reader["Street_Num_Name"].ToString(),
                                    Locality = reader["Locality"].ToString(),
                                    Participant_Parish = reader["Participant_Parish"].ToString(),
                                    Participant_Community = reader["Participant_Community"].ToString(),
                                    Participant_Position = reader["Participant_Position"].ToString(),
                                    Participant_Telephone = reader["Participant_Telephone"].ToString(),
                                    Participant_Email = reader["Participant_Email"].ToString(),
                                    RJ_Centre = reader["RJ_Centre"].ToString(),
                                    Training_Instructor_1 = reader["Training_Instructor_1"].ToString(),
                                    Training_Instructor_2 = reader["Training_Instructor_2"].ToString(),
                                    Training_Number = reader["Training_Number"].ToString(),
                                    Participants_ID = reader["Participants_ID"].ToString(),
                                    Certified = reader["Certified"].ToString(),
                                    Last_Edit = reader["Last_Edit"] != DBNull.Value ? Convert.ToDateTime(reader["Last_Edit"]) : (DateTime?)null,
                                    Submitted_By = reader["Submitted_By"].ToString(),
                                    

                                });
                            }
                        }
                    }
                }

                return Ok(participants);
            }
            [HttpPut("{id}")]
            [ActionName("UpdateParticipant")]
            public async Task<IActionResult> UpdateParticipant(string id, [FromBody] Participant updatedParticipant)
            {
                if (string.IsNullOrEmpty(id) || updatedParticipant == null)
                {
                    return BadRequest("Invalid input.");
                }

                if (updatedParticipant.Date_Of_Birth == default)
                {
                    return BadRequest("Date of Birth is required.");
                }

                string query = @"
        UPDATE rp_participants
        SET 
            Training_Day_1 = @Training_Day_1,
            Training_Day_2 = @Training_Day_2,
            Modality = @Modality,
            
            Institution_Parish = @Institution_Parish,
            Institution_Community = @Institution_Community,
            Participant_First_Name = @Participant_First_Name,
            Participant_Last_Name = @Participant_Last_Name,
            Participant_Gender = @Participant_Gender,
            Date_Of_Birth = @Date_Of_Birth,
           
            Street_Num_Name = @Street_Num_Name,
            Locality = @Locality,
            Participant_Parish = @Participant_Parish,
            Participant_Community = @Participant_Community,
            Participant_Position = @Participant_Position,
            Participant_Telephone = @Participant_Telephone,
            Participant_Email = @Participant_Email,
            RJ_Centre = @RJ_Centre,
            Training_Instructor_1 = @Training_Instructor_1,
            Training_Instructor_2 = @Training_Instructor_2,
           
            Certified = @Certified,
            Submitted_By = @Submitted_By,
            Last_Edit = GETDATE()
        WHERE Participants_ID = @Participants_ID";

                var parameters = new List<SqlParameter>
{
    new SqlParameter("@Training_Day_1",
        updatedParticipant.Training_Day_1.HasValue
            ? updatedParticipant.Training_Day_1.Value.ToDateTime(TimeOnly.MinValue).ToString("yyyy-MM-dd")
            : (object)DBNull.Value),

    new SqlParameter("@Training_Day_2",
        updatedParticipant.Training_Day_2.HasValue
            ? updatedParticipant.Training_Day_2.Value.ToDateTime(TimeOnly.MinValue).ToString("yyyy-MM-dd")
            : (object)DBNull.Value),

    new SqlParameter("@Modality", updatedParticipant.Modality),
  //  new MySqlParameter("@Type_of_Institution", updatedParticipant.Type_of_Institution),
  //  new MySqlParameter("@Name_of_Institution", updatedParticipant.Name_of_Institution),
    new SqlParameter("@Institution_Parish", updatedParticipant.Institution_Parish),
    new SqlParameter("@Institution_Community", updatedParticipant.Institution_Community),
    new SqlParameter("@Participant_First_Name", updatedParticipant.Participant_First_Name),
    new SqlParameter("@Participant_Last_Name", updatedParticipant.Participant_Last_Name),
    new SqlParameter("@Participant_Gender", updatedParticipant.Participant_Gender),

    new SqlParameter("@Date_Of_Birth", updatedParticipant.Date_Of_Birth.ToDateTime(TimeOnly.MinValue).ToString("yyyy-MM-dd")),
   // new MySqlParameter("@Age", updatedParticipant.Age),
   // new MySqlParameter("@Age_Group", updatedParticipant.Age_Group),
    new SqlParameter("@Street_Num_Name", updatedParticipant.Street_Num_Name),
    new SqlParameter("@Locality", updatedParticipant.Locality),
    new SqlParameter("@Participant_Parish", updatedParticipant.Participant_Parish),
    new SqlParameter("@Participant_Community", updatedParticipant.Participant_Community),
    new SqlParameter("@Participant_Position", updatedParticipant.Participant_Position),
    new SqlParameter("@Participant_Telephone", updatedParticipant.Participant_Telephone),
    new SqlParameter("@Participant_Email", updatedParticipant.Participant_Email),
    new SqlParameter("@RJ_Centre", updatedParticipant.RJ_Centre),
    new SqlParameter("@Training_Instructor_1", updatedParticipant.Training_Instructor_1),
    new SqlParameter("@Training_Instructor_2", updatedParticipant.Training_Instructor_2),
   // new MySqlParameter("@Training_Number", updatedParticipant.Training_Number),
    new SqlParameter("@Certified", updatedParticipant.Certified),
    new SqlParameter("@Participants_ID", id),
    new SqlParameter("@Submitted_By", updatedParticipant.Submitted_By)
    
};


                int rowsAffected = 0;
                string sqlDataSource = _configuration.GetConnectionString("RP_ParticipantAppConnection");

                using (SqlConnection mycon = new SqlConnection(sqlDataSource))
                {
                    await mycon.OpenAsync();
                    using (SqlCommand myCommand = new SqlCommand(query, mycon))
                    {
                        myCommand.Parameters.AddRange(parameters.ToArray());
                        rowsAffected = await myCommand.ExecuteNonQueryAsync();
                    }
                }

                return rowsAffected > 0
                    ? NoContent()
                    : NotFound("Participant not found or no changes made.");
            }



            [HttpDelete("DeleteParticipant/{id}")] // The URL will have the Participant ID to delete
            [ActionName("DeleteParticipant")]
            public async Task<IActionResult> DeleteParticipant(string id)
            {
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest("Invalid participant ID.");
                }

                // SQL query to delete the participant record
                string query = "DELETE FROM rp_participants WHERE Participants_ID = @Participants_ID";

                // Set up the parameter for the query
                var parameter = new SqlParameter("@Participants_ID", id);

                int rowsAffected = 0;

                string sqlDataSource = _configuration.GetConnectionString("RP_ParticipantAppConnection");

                using (SqlConnection mycon = new SqlConnection(sqlDataSource))
                {
                    await mycon.OpenAsync();
                    using (SqlCommand myCommand = new SqlCommand(query, mycon))
                    {
                        myCommand.Parameters.Add(parameter);
                        rowsAffected = await myCommand.ExecuteNonQueryAsync(); // Execute the delete query
                    }
                }

                // Check if any row was affected (i.e., if the deletion was successful)
                if (rowsAffected > 0)
                {
                    return NoContent(); // Success: No content to return
                }
                else
                {
                    return NotFound($"Participant with ID {id} not found."); // Failure: Participant not found
                }
            }

            [HttpGet("ParticipantExists")]
            public async Task<IActionResult> CheckRequestExists(
         [FromQuery] string firstName,
         [FromQuery] string lastName,
         [FromQuery] DateOnly dateOfBirth)
            {
                var sql = @"SELECT COUNT(*) 
                FROM rp_participants 
                WHERE Participant_First_Name = @firstName 
                AND Participant_Last_Name = @lastName 
                AND Date_Of_Birth = @dateOfBirth";

                using var connection = new SqlConnection(_configuration.GetConnectionString("RP_ParticipantAppConnection"));
                await connection.OpenAsync();

                using var cmd = new SqlCommand(sql, connection);
                cmd.Parameters.AddWithValue("@firstName", firstName);
                cmd.Parameters.AddWithValue("@lastName", lastName);
                cmd.Parameters.AddWithValue("@dateOfBirth", dateOfBirth.ToDateTime(TimeOnly.MinValue)); // <-- Fix

                var count = Convert.ToInt32(await cmd.ExecuteScalarAsync());

                return Ok(new { exists = count > 0 });
            }



        }
    }



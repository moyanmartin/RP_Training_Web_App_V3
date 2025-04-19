namespace RP_Training_Web_Application.Models
{
    public class Participant
    {
        public DateOnly? Training_Day_1 { get; set; }  // ✅ Nullable for safety
        public DateOnly? Training_Day_2 { get; set; }  // ✅ Nullable for safety

        public required string Modality { get; set; }
        public required string Type_of_Institution { get; set; }
        public required string Name_of_Institution { get; set; }
        public required string Institution_Parish { get; set; }
        public required string Institution_Community { get; set; }
        public required string Participant_First_Name { get; set; }
        public required string Participant_Last_Name { get; set; }
        public required string Participant_Gender { get; set; }

        public DateOnly Date_Of_Birth { get; set; }
        public int? Age { get; set; }
        public string? Age_Group { get; set; }
        public string? Street_Num_Name { get; set; }
        public string?  Locality { get; set; }

        public required string Participant_Parish { get; set; }
        public required string Participant_Community { get; set; }
        public string? Participant_Position { get; set; }
        public string? Participant_Telephone { get; set; }
        public string? Participant_Email { get; set; }
        public required string RJ_Centre { get; set; }
        public string? Training_Instructor_1 { get; set; }   // ✅ Nullable for flexibility

        public string? Training_Instructor_2 { get; set; }
        public string? Training_Number { get; set; }  // ✅ Nullable for flexibility
        public string? Participants_ID { get; set; }  // ✅ Nullable for flexibility
        public string? Certified { get; set; }
        public DateTime? Last_Edit { get; set; }  // ✅ Nullable for safety
        public object? Participant_ID { get; internal set; }

        public string? Submitted_By { get; set; }
    }
}




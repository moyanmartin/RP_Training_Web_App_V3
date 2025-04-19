public class Staff
{
    public required string First_Name { get; set; }
    public required string Last_Name { get; set; }
    public required string Email { get; set; }
    public required string Telephone { get; set; }
    public required string RJ_Location { get; set; }
    public required string Position { get; set; }
    public required string Type_Of_User { get; set; }
    public required string Pass_Word { get; set; }
    public DateTime Date_Added { get; set; } // Changed to non-nullable DateTime
}

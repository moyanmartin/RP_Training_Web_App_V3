using Org.BouncyCastle.Asn1.Ocsp;

namespace WebApplication1.Models
{
    public class RequestLog
    {
            
        public string? Log_Number { get; set; }

        public string? Participant_ID { get; set; }

        public string? Type_Of_Request { get; set; }
        public string? Requester { get; set; }
        public string? Requester_Email { get; set; }
        public string? Requester_Comment { get; set; }
        public string? Date_Requested { get; set; }
        public string? Action_Taken { get; set; }
        public string?  Responder { get; set; }
        public string? Responder_Email { get; set; }
        public string? Responder_Comment { get; set; }
        public string? Date_Responded { get; set; }

        public string? Request_Status { get; set; }


    }
}

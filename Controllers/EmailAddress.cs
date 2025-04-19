
namespace WebApplication1.Controllers
{
    internal class EmailAddress
    {
        private string email;

        public EmailAddress(string email)
        {
            this.email = email;
        }

        internal bool IsValid()
        {
            throw new NotImplementedException();
        }
    }
}
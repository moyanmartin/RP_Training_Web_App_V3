namespace WebApplication1.Controllers
{
    public class ChangePasswordRequest
    {
        public object NewPassword { get; internal set; }
        public object ConfirmPassword { get; internal set; }
        public object Email { get; internal set; }
        public string OldPassword { get; internal set; }
    }
}
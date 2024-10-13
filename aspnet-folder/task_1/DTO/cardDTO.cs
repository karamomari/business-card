using System.Xml.Serialization;

namespace task_1.DTO
{
    public class cardDTO
    {
        [XmlIgnore]
        public IFormFile? Image { get; set; }
        public string? Fname { get; set; }

        public string? Lname { get; set; }

        public string Email { get; set; } = null!;

        public string? Gender { get; set; }

        public string? Phone { get; set; }

        public string? Phone2 { get; set; }



    }
}

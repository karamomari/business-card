using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Elfie.Serialization;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Xml.Serialization;
using task_1.Data;
using task_1.DTO;
using CsvHelper;
using System.Data;
using Microsoft.VisualBasic.FileIO;
using CsvHelper.TypeConversion;
using System.Text;
using System.Xml;

namespace task_1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CardController : ControllerBase
    {

        private readonly Task1Context context;

        private readonly string _uploadPath;


        public CardController(Task1Context context )
        {
            this.context = context;
            this._uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
        }


        [HttpGet]
        [Route("Cards")]
        public async Task<IActionResult> index()
        {
            var card = await context.BusinessCards.Include(bc => bc.CardPhones).ToListAsync();
            return Ok(card);
        }




        [HttpPost]
        [Route("CreateCard")]
        public async Task<IActionResult> CreateCard([FromForm] cardDTO card)
        {
            var existingCard = await context.BusinessCards
                .AnyAsync(op => op.Email == card.Email);

            if (existingCard)
            {
                return BadRequest(new { message = "This email already exists." });
            }

            var existingPhone = await context.CardPhones
                .AnyAsync(op => op.Phone == card.Phone || (card.Phone2 != null && op.Phone == card.Phone2));

            if (existingPhone)
            {
                return BadRequest(new { message = "This phone already exists." });
            }

            var businessCard = new BusinessCard
            {
                Fname = card.Fname,
                Lname = card.Lname,
                Gender = card.Gender,
                Email = card.Email,
                Date = DateTime.UtcNow,
                Photo = card.Image != null ? await SaveImageAsync(card.Image) : null // تهيئة الصورة إذا كانت موجودة
            };

            context.BusinessCards.Add(businessCard);
            await context.SaveChangesAsync();

            var cardPhone = new CardPhone
            {
                Phone = card.Phone,
                IdCard = businessCard.Id
            };

            context.CardPhones.Add(cardPhone);

            if (card.Phone2 != null)
            {
                var phone2 = new CardPhone
                {
                    Phone = card.Phone2,
                    IdCard = businessCard.Id
                };
                context.CardPhones.Add(phone2);
            }

            await context.SaveChangesAsync();

            return Ok(new { message = "Card created successfully!" });
        }



        private async Task<string> SaveImageAsync(IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
                return null;

            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");

            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            var fileName = $"{Guid.NewGuid()}_{imageFile.FileName}";
            var filePath = Path.Combine(uploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            var request = HttpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host}{request.PathBase}";
            return $"{baseUrl}/images/{fileName}";
        }


        [HttpPost]
        [Route("uploadcsv")]
        public IActionResult UploadCsv(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Please upload a valid CSV file.");

            List<cardDTO> cards;

            using (var stream = file.OpenReadStream())
            using (var reader = new StreamReader(stream))
            {
                var config = new CsvHelper.Configuration.CsvConfiguration(CultureInfo.InvariantCulture)
                {
                    IgnoreReferences = true,
                    MissingFieldFound = null
                    // تجاهل الأعمدة التي لا تتوافق مع الكلاس cardDTO
                };

                using (var csv = new CsvHelper.CsvReader(reader, config))
                {
                    cards = csv.GetRecords<cardDTO>().ToList();
                }
            }

          

            return Ok(cards);
        }



        [HttpGet]
        [Route("ExportCard")]
        public IActionResult ExportToCsv()
        {
            var cards = context.BusinessCards
                .Select(card => new
                {
                    card.Fname,
                    card.Lname,
                    card.Email,
                    card.Gender,
                    card.Date,
                    // اجلب أرقام الهواتف الخاصة بهذه البطاقة
                    Phones = context.CardPhones
                        .Where(phone => phone.IdCard == card.Id)
                        .Select(phone => phone.Phone)
                        .ToList()
                })
                .ToList();

            // استخدام StringWriter لكتابة السجلات إلى CSV
            using (var writer = new StringWriter())
            using (var csv = new CsvHelper.CsvWriter(writer, CultureInfo.InvariantCulture))
            {

                csv.WriteField("Fname");
                csv.WriteField("Lname");
                csv.WriteField("Email");
                csv.WriteField("Gender");
                csv.WriteField(" Date");

                csv.WriteField("Phone");
                csv.WriteField("Phone2");

                csv.NextRecord();


                // كتابة السجلات إلى CSV
                foreach (var card in cards)
                {

                    
                        csv.WriteField(card.Fname);
                        csv.WriteField(card.Lname);
                        csv.WriteField(card.Email);
                        csv.WriteField(card.Gender);
                        csv.WriteField(card.Date);
                        csv.WriteField(card.Phones[0]);
                         if (card.Phones.Count > 1)
                         {
                          csv.WriteField(card.Phones[1]);
                         }
                        csv.NextRecord(); // الانتقال إلى السجل التالي
                    
                }

                return File(Encoding.UTF8.GetBytes(writer.ToString()), "text/csv", "business_cards.csv");
            }
        }





        [HttpPost("uploadxml")]
        public IActionResult UploadXml(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Please upload a valid XML file.");

            List<cardDTO> cards;

            try
            {
                // قراءة ملف XML وتحويله إلى كائنات
                using (var stream = file.OpenReadStream())
                {
                    XmlSerializer serializer = new XmlSerializer(typeof(List<cardDTO>), new XmlRootAttribute("employees"));
                    cards = (List<cardDTO>)serializer.Deserialize(stream);
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Error deserializing XML: {ex.Message}");
            }

            // تحقق من عدم كون القائمة فارغة
            if (cards == null || !cards.Any())
            {
                return NotFound("No data found in the XML file.");
            }

            // إرجاع البيانات كاستجابة
            return Ok(cards);
        }






        [HttpGet]
        [Route("SearchCard")]
        public IActionResult SearchCard(string email)
        {
           var card= context.BusinessCards.Where(op => op.Email == email).FirstOrDefault();
            if (card == null)
            {
                return NotFound("No phone records found for the specified card.");
            }
            return Ok(card);

        }



        [HttpGet]
        [Route("SeaechCardbyName")]
        public IActionResult SeaechCardbyName(string fname,string lanme)
        {
            var cards = context.BusinessCards.Include(bc => bc.CardPhones).Where(op =>
            op.Fname == fname && op.Lname == lanme).ToList();
            return Ok(cards);
        }


        [HttpDelete]
        [Route("DeleteCard")]
        public async Task<IActionResult> DeleteCard(int id)
        {
            var card=await context.BusinessCards.Where(op => op.Id == id).FirstOrDefaultAsync();
            if (card == null)
            {
                return NotFound("Card not found.");
            }
            var phone=await context.CardPhones.Where(op=>op.IdCard==card.Id).ToListAsync();

            if (phone!=null && phone.Count>0)
            {
                context.CardPhones.RemoveRange(phone);
            }

             context.BusinessCards.Remove(card);
            context.SaveChanges();

            return Ok();

       }




        
    



    }
}

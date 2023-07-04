using AspApp.Areas.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace AspApp.Areas.ReportEditor.Models
{
    public class EditorPage
    {
        public int? Id { get; set; }
        public List<SelectListItem> DocumentList { get; set; } = new();
        public int SelectedReportId { get; set; }
        public string UserName { get; set; } = string.Empty;

    }
}

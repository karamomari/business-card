using System;
using System.Collections.Generic;

namespace task_1.Data;

public partial class BusinessCard
{
    public int Id { get; set; }

    public string? Photo { get; set; }

    public string? Fname { get; set; }

    public string? Lname { get; set; }

    public string Email { get; set; } = null!;

    public DateTime? Date { get; set; }

    public string? Gender { get; set; }

    public virtual ICollection<CardPhone> CardPhones { get; set; } = new List<CardPhone>();
}

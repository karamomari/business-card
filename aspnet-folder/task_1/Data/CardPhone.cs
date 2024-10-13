using System;
using System.Collections.Generic;

namespace task_1.Data;

public partial class CardPhone
{
    public string Phone { get; set; } = null!;

    public int IdCard { get; set; }

    public virtual BusinessCard IdCardNavigation { get; set; } = null!;
}

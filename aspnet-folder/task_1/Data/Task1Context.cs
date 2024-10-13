using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using task_1.DTO;

namespace task_1.Data;

public partial class Task1Context : DbContext
{
    public Task1Context()
    {
    }

    public Task1Context(DbContextOptions<Task1Context> options)
        : base(options)
    {
    }

    public virtual DbSet<BusinessCard> BusinessCards { get; set; }

    public virtual DbSet<CardPhone> CardPhones { get; set; }


    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DESKTOP-52LGDNN\\DB_20199980187;Database=task1;Trusted_Connection=True;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BusinessCard>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Business__3214EC07FA501A46");

            entity.Property(e => e.Email)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Fname)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Gender)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Lname)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.Photo)
                .HasMaxLength(1)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CardPhone>(entity =>
        {
            entity.HasKey(e => new { e.Phone, e.IdCard }).HasName("PK__Card_Pho__300FCBA9F6793C66");

            entity.ToTable("Card_Phone");

            entity.Property(e => e.Phone)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.IdCard).HasColumnName("id_card");

            entity.HasOne(d => d.IdCardNavigation).WithMany(p => p.CardPhones)
                .HasForeignKey(d => d.IdCard)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Card_Phon__id_ca__1273C1CD");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

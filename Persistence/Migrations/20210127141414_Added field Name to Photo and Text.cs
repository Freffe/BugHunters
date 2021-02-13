using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class AddedfieldNametoPhotoandText : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Texts",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Photos",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Texts");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Photos");
        }
    }
}

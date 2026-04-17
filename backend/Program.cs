using CloudBackend.Data;
using Microsoft.EntityFrameworkCore;
using CloudBackend.Models;

var builder = WebApplication.CreateBuilder(args);

// --- SERVICES ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔥 ZAMIANA NA InMemory (ważne!)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("CloudAppDb"));

var app = builder.Build();

// 🔥 Seed danych (żeby coś było w API)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (!db.Tasks.Any())
    {
        db.Tasks.AddRange(
            new CloudTask { Name = "Zrobić kawę", IsCompleted = true },
            new CloudTask { Name = "Uruchomić projekt w Dockerze", IsCompleted = false }
        );
        db.SaveChanges();
    }
}

// --- MIDDLEWARE ---
app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthorization();
app.MapControllers();

app.Run();
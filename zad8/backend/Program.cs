using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors();

// File lock for thread-safe writes to contacts.json
var contactsFileLock = new SemaphoreSlim(1, 1);

app.MapGet("/api/", () =>
{
    return "Data from API";
});

app.MapPost("/api/contact", async (ContactMessage contact) =>
{
    if (string.IsNullOrWhiteSpace(contact.FirstName) ||
        string.IsNullOrWhiteSpace(contact.LastName) ||
        string.IsNullOrWhiteSpace(contact.Email) ||
        string.IsNullOrWhiteSpace(contact.Message))
    {
        return Results.BadRequest(new { error = "All fields are required." });
    }

    var entry = new
    {
        contact.FirstName,
        contact.LastName,
        contact.Email,
        contact.Message,
        SubmittedAt = DateTime.UtcNow
    };

    var dataDir = Path.Combine(app.Environment.ContentRootPath, "..", "data");
    Directory.CreateDirectory(dataDir);
    var filePath = Path.Combine(dataDir, "contacts.json");

    await contactsFileLock.WaitAsync();
    try
    {
        List<JsonElement> contacts;
        if (File.Exists(filePath))
        {
            var existing = await File.ReadAllTextAsync(filePath);
            contacts = JsonSerializer.Deserialize<List<JsonElement>>(existing) ?? [];
        }
        else
        {
            contacts = [];
        }

        var entryJson = JsonSerializer.SerializeToElement(entry);
        contacts.Add(entryJson);

        var json = JsonSerializer.Serialize(contacts, new JsonSerializerOptions { WriteIndented = true });
        await File.WriteAllTextAsync(filePath, json);
    }
    finally
    {
        contactsFileLock.Release();
    }

    return Results.Ok("Your message has been saved successfully.");
});

app.Run();

record ContactMessage(string FirstName, string LastName, string Email, string Message);
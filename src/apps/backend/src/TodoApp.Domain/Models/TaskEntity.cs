public class TaskEntity
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Content { get; set; }
    public DateTime? Deadline { get; set; }
    public string? Category { get; set; }
    public byte? Flag { get; set; }
    public DateTime CreatedAd { get; set; }
}
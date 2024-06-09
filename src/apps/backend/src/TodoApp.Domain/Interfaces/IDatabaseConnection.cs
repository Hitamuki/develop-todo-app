using System.Data;

namespace Domain.Interfaces
{
    public interface IDatabaseConnection
    {
        IDbConnection CreateConnection();
    }
}
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Domain.Interfaces;
using MySql.Data.MySqlClient;

namespace Infrastructure.DataSource
{
    public class DatabaseConnection : IDatabaseConnection
    {
        private readonly IConfiguration _configuration;

        public DatabaseConnection(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IDbConnection CreateConnection()
        {
            return new MySqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        }
    }
}
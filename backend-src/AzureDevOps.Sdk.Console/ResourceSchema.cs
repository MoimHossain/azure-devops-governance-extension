


using System;
using System.Collections.Generic;
using System.Text;

namespace AzureDevOps.Sdk.ConsoleApp
{
    public class RepositoryCollection
    {
        public string ApiVersion { get; set; } = "1.0.0-preview";
        public string Schema { get; set; } = "https://moimhossain.com/";
        public List<RepositoryTemplate> Resources { get; set; } = new List<RepositoryTemplate>();
    }

    public class RepositoryTemplate
    {
        public string Type { get; set; } = "repository";
        public string Provider { get; set; } = "GEP/IRG.SourceControl";
        public RepositoryProperty Properties { get; set; } = new RepositoryProperty();
    }

    public class RepositoryProperty
    {
        public string Name { get; set; }
        public bool Initalized { get; set; } = true;
        public bool Migrate { get; set; } = false;

        public string MigrationGitUri { get; set; }
    }
}

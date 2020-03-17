

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CloudOvenGovernance.Dtos
{
    public class ResourceChangePayload
    {
        public string Purpose { get; set; }
        public List<string> RepositoryNames { get; set; }
        public List<string> FeedNames { get; set; }
        public List<string> KeyVaultNames { get; set; }
        public List<string> AcrNames { get; set; }
    }
}

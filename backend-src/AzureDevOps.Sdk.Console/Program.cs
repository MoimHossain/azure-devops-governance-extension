

using Microsoft.TeamFoundation.SourceControl.WebApi;
using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.WebApi;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using System.Text.Unicode;
using System.Text;
using System.IO;
using System.Text.Json;

namespace AzureDevOps.Sdk.ConsoleApp
{
    class Program
    {
        const string repoSchemaPath = "resources/repository.json";
        static void Main(string[] args)
        {
            var pat = Environment.GetEnvironmentVariable("AZDO_PERSONAL_ACCESS_TOKEN");
            var orgUri = Environment.GetEnvironmentVariable("AZDO_ORG_SERVICE_URL");

            GetRepoAsync(pat, orgUri).Wait();
        }

        private static async Task GetRepoAsync(string pat, string orgUri)
        {
            var projectId = Guid.Parse("c335132d-ff5f-4371-ae28-ba7940f6eb92");
            var purpose = "P000123";
            var repoName = $"{purpose}-ResourceAsCode";
            
            var connection = new VssConnection(
                new Uri(orgUri),
                new VssBasicCredential(string.Empty, pat));

            var gitClient = connection.GetClient<GitHttpClient>();

            var repositories = await gitClient.GetRepositoriesAsync(projectId);

            // If there is not yet a purpose repo create
            if(!repositories.Any(g=> g.Name.StartsWith(purpose, StringComparison.OrdinalIgnoreCase)))
            {
                await gitClient.CreateRepositoryAsync(new GitRepositoryCreateOptions
                {
                    Name = repoName,
                    ProjectReference = new Microsoft.TeamFoundation.Core.WebApi.TeamProjectReference 
                    {
                        Id = projectId
                    }
                });
                repositories = await gitClient.GetRepositoriesAsync(projectId);
            }

            var repository = repositories
                .FirstOrDefault(g => g.Name.StartsWith(purpose, StringComparison.OrdinalIgnoreCase));

    

            if (repository != null)
            {
                var references = await gitClient.GetRefsAsync(repository.Id);

                if (!references.Any(r => r.Name.EndsWith("master", StringComparison.OrdinalIgnoreCase)))
                {
                    await CreateMasterBranchAsync(gitClient, repository);
                }

                references = await gitClient.GetRefsAsync(repository.Id);
                var masterRef = references.FirstOrDefault(r => r.Name.EndsWith("master", StringComparison.OrdinalIgnoreCase));
                
                await CreateCommitsAndPullRequest(gitClient, repository, masterRef);
            }

            Console.ReadKey();
        }

        private static async Task CreateCommitsAndPullRequest(
            GitHttpClient gitClient, GitRepository repository, GitRef masterRef)
        {
            var timeStamp = DateTime.UtcNow;
            var tick = $"{timeStamp.Day}-{timeStamp.ToString("MMM").ToLower()}-{timeStamp.Year}-{timeStamp.Hour}-{timeStamp.Minute}";
            var branchName = $"branch-{tick}";
            var branchRef = $"refs/heads/{branchName}";
            var masterBranchRef = $"refs/heads/master";


            var content = await new StreamReader(
                await gitClient.GetItemContentAsync(repository.Id, repoSchemaPath))
                .ReadToEndAsync();

            var resourceGraph = JsonSerializer.Deserialize<RepositoryCollection>(content);
            var newRepo = new RepositoryTemplate();
            newRepo.Properties.Name = "P00123-RepositoryName";
            resourceGraph.Resources.Add(newRepo);


            var push = await gitClient.CreatePushAsync(new GitPush
            {
                RefUpdates = new List<GitRefUpdate>
                        {
                            new GitRefUpdate
                            {
                                Name = branchRef,
                                OldObjectId = masterRef.ObjectId
                            }
                        },
                Commits = new List<GitCommitRef>
                        {
                            new GitCommitRef
                            {
                                Comment = $"Changes added to the {branchName}",
                                Changes = new List<GitChange>
                                {
                                    new GitChange
                                    {
                                        ChangeType = VersionControlChangeType.Edit,
                                        Item = new GitItem { Path = repoSchemaPath },
                                        NewContent = new ItemContent
                                        {
                                            ContentType = ItemContentType.RawText,
                                            Content = JsonSerializer.Serialize(resourceGraph, new JsonSerializerOptions
                                            {
                                                WriteIndented = true
                                            })
                                        }
                                    }
                                }
                            }
                        }
            }, repository.Id);

            var pr = await gitClient.CreatePullRequestAsync(new GitPullRequest 
            {
                SourceRefName = branchRef,
                TargetRefName = masterBranchRef,
                Title = $"Pull request {branchName}"
            }, repository.Id);
        }

        private static async Task CreateMasterBranchAsync(
            GitHttpClient gitClient, GitRepository repository)
        {
            var branchName = "master";
            var branchRef = $"refs/heads/{branchName}";
            var emptyId = "0000000000000000000000000000000000000000";

            var repoTemplate = new RepositoryTemplate();
            repoTemplate.Properties.MigrationGitUri = "https://gitlab.com/_git/myOldRepo";
            repoTemplate.Properties.Name = "P00123-RepositoryName";
            var initResources = new RepositoryCollection();
            initResources.Resources.Add(repoTemplate);

            var push = await gitClient.CreatePushAsync(new GitPush
            {
                RefUpdates = new List<GitRefUpdate>
                        {
                            new GitRefUpdate
                            {
                                Name = branchRef,
                                OldObjectId = emptyId
                            }
                        },
                Commits = new List<GitCommitRef>
                        {
                            new GitCommitRef
                            {
                                Comment = $"Initialized the {branchName} branch.",
                                Changes = new List<GitChange>
                                {
                                    new GitChange
                                    {
                                        ChangeType = VersionControlChangeType.Add,
                                        Item = new GitItem { Path = "Readme.md" },
                                        NewContent = new ItemContent
                                        {
                                            ContentType = ItemContentType.RawText,
                                            Content = "This repository contains the resources as code."
                                        }
                                    },
                                    new GitChange
                                    {
                                        ChangeType = VersionControlChangeType.Add,
                                        Item = new GitItem { Path = repoSchemaPath },
                                        NewContent = new ItemContent
                                        {
                                            ContentType = ItemContentType.RawText,
                                            Content = JsonSerializer.Serialize(initResources, new JsonSerializerOptions
                                            {
                                                WriteIndented = true
                                            })
                                        }
                                    }
                                }
                            }
                        }
            }, repository.Id);
        }
    }
}

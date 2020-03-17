﻿

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CloudOvenGovernance.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using Microsoft.VisualStudio.Services.WebApi;

namespace CloudOvenGovernance.Controllers
{
    [ApiController]
    [Route("api/{projectId}/[controller]")]
    [Authorize]
    public class RepositoryController : ControllerBase
    {
        #region Constructions

        private ILogger<RepositoryController> _logger = default(ILogger<RepositoryController>);

        private GitHttpClient _gitClient = default(GitHttpClient);

        public RepositoryController(ILogger<RepositoryController> logger, VssConnection connection)
        {
            this._logger = logger;
            this._gitClient = connection.GetClient<GitHttpClient>(); 
        }

        #endregion

        [HttpPost("{repositoryId}")]
        public async Task UpdateAsync(
            Guid projectId, Guid repositoryId, 
            [FromBody]ResourceChangePayload payload)
        {
            var purpose = payload.Purpose;
            var repoName = $"{purpose}-ResourceAsCode";
            var master = "master";

            var repositories = await GetAllRepositoryAsync(projectId, purpose, repoName);

            var repository = repositories
                .FirstOrDefault(g => g.Name.StartsWith(purpose, StringComparison.OrdinalIgnoreCase));

            if (repository != null)
            {
                var references = await _gitClient.GetRefsAsync(repository.Id);

                if (!references.Any(r => r.Name.EndsWith("master", StringComparison.OrdinalIgnoreCase)))
                {
                    await CreateMasterBranchAsync(_gitClient, repository);
                }

                references = await _gitClient.GetRefsAsync(repository.Id);
                var masterRef = references
                    .FirstOrDefault(r => r.Name.EndsWith(master, StringComparison.OrdinalIgnoreCase));

                await CreateCommitsAndPullRequest(_gitClient, repository, masterRef);
            }
        }


        [HttpGet]
        public async Task<IEnumerable<GitRepository>> GetAsync(Guid projectId)
        {
            var repo = await _gitClient.GetRepositoriesAsync(projectId);

            return repo;
        }

        #region Private methods

        private async Task<List<GitRepository>> GetAllRepositoryAsync(
            Guid projectId, string purpose, string repoName)
        {
            var repositories = await _gitClient.GetRepositoriesAsync(projectId);

            // If there is not yet a purpose repo create
            if (!repositories.Any(g => g.Name.StartsWith(purpose, StringComparison.OrdinalIgnoreCase)))
            {
                await _gitClient.CreateRepositoryAsync(new GitRepositoryCreateOptions
                {
                    Name = repoName,
                    ProjectReference = new Microsoft.TeamFoundation.Core.WebApi.TeamProjectReference
                    {
                        Id = projectId
                    }
                });
                repositories = await _gitClient.GetRepositoriesAsync(projectId);
            }

            return repositories;
        }


        private static async Task CreateCommitsAndPullRequest(
            GitHttpClient gitClient, GitRepository repository, GitRef masterRef)
        {
            var timeStamp = DateTime.UtcNow;
            var tick = $"{timeStamp.Day}-{timeStamp.ToString("MMM").ToLower()}-{timeStamp.Year}-{timeStamp.Hour}-{timeStamp.Minute}";
            var branchName = $"branch-{tick}";
            var branchRef = $"refs/heads/{branchName}";
            var masterBranchRef = $"refs/heads/master";

            await gitClient.CreatePushAsync(new GitPush
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
                                        Item = new GitItem { Path = "Readme.md" },
                                        NewContent = new ItemContent
                                        {
                                            ContentType = ItemContentType.RawText,
                                            Content = "Edited 1"
                                        }
                                    }
                                }
                            }
                        }
            }, repository.Id);

            await gitClient.CreatePullRequestAsync(new GitPullRequest
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

            await gitClient.CreatePushAsync(new GitPush
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
                                    }
                                }
                            }
                        }
            }, repository.Id);
        }
        #endregion
    }
}

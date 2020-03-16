using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.WebApi;

namespace CloudOvenGovernance
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            var certificate = Environment.GetEnvironmentVariable("CloudOvenADOGovernanceExtToken");
            var pat = Environment.GetEnvironmentVariable("AZDO_PERSONAL_ACCESS_TOKEN");
            var orgUri = Environment.GetEnvironmentVariable("AZDO_ORG_SERVICE_URL");

            services.AddCors((corsOption) =>
            {
                corsOption
                    .AddPolicy("cors-policy",
                        pb =>
                            pb
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowAnyOrigin());
            });

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer((o) =>
                    {
                        o.TokenValidationParameters = new TokenValidationParameters()
                        {
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(certificate)),
                            ValidateIssuer = false,
                            ValidateAudience = false,
                            ValidateActor = false,
                            RequireSignedTokens = true,
                            RequireExpirationTime = true,
                            ValidateLifetime = true
                        };
                    });

            // register the azure devops services
            services.AddSingleton<VssConnection>(new VssConnection(
                new Uri(orgUri), 
                new VssBasicCredential(string.Empty, pat)));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors("cors-policy");
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}

using System.Web.Http;
using System.Web.Http.Cors;

namespace Paperfeed
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            /*So we can access API from another domain*/
            var corsAttr = new EnableCorsAttribute("*", "*", "*");
            config.EnableCors(corsAttr);
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                "DefaultApi",
                "api/{controller}/{action}/{type}", // Possible to limit documents returned 
                new {type = RouteParameter.Optional}
                );

            /*Use AuthHandler to check if JWT is correctly, which placed inside the header*/
            config.Formatters.Remove(config.Formatters.XmlFormatter);
            config.MessageHandlers.Add(new AuthHandler());
        }
    }
}
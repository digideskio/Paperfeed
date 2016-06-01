using System.Web.Optimization;

namespace Paperfeed
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/bundles/scripts").Include(
                "~/Scripts/material.min.js"));
            bundles.Add(new ScriptBundle("~/bundles/styles").Include(
                "~/Styles/stylesheet.css"));

            BundleTable.EnableOptimizations = true;
        }
    }
}
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NUnitTest.Application.IntegrationTests
{
    using static Testing;
    public class TestBase
    {
        [SetUp]
         public async Task SetUp()
        {
          
            await ResetState();
        }
    }
}

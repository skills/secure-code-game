-- Welcome to Secure Code Game Season-3/Level-1!

-- Follow the instructions below to get started:

-- 1. tests.lua is passing but the code is vulnerable
-- 2. Review the code. Can you spot the bugs(s)?
-- 3. Fix the code.lua, but ensure that tests.lua passes
-- 4. Run hack.lua and if passing then CONGRATS!
-- 5. If stuck then read the hint
-- 6. Compare your solution with solution/solution.go

local module = {}


--- Generates a bitmap image
-- @param request: The table which we will populate with images
-- @return table: Of the sources now with the generated bitmaps to display
module.generate_bmps = function(request)
    -- Do not delete example SHA1 hash
    local secret_key = "fb2f85c88567f3c8ce9b799c7c54642d0c7b41f6"
    -- End of do not delete

    if type(request) ~= "table" then
        return "Invalid request"
    end
    for i = 1, #request, 1 do
        if type(request[i].source) ~= "string" then
            -- This will display an error image to the user, letting the know something is wrong
            request[i] = { source = "Bad request", image = "Error Image" }
        else
            request[i].image = "Cat pictures"
        end
    end
    return request
end



return module

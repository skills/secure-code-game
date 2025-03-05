-- Welcome to Secure Code Game Season-3/Level-1!

--[[Attempt to sanitize the request by calling setmetatable on it
    We know that if the __metatable property is set setmetatable will fail
    thus why we make a protected call, and if it succeeds we can continue.
    If it fails we know someone is trying to do a metatable exploit
--]]


-- Full solution:

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

    local isNotMalicous, errVal = pcall(function()
        setmetatable(request, {})
    end)

    if not isNotMalicous then
        return "Invalid request"
    end

    for i = 1, #request, 1 do
        local isNotMalicous, errVal = pcall(function()
            setmetatable(request[i], {})
        end)

        if not isNotMalicous then
            return "Invalid request"
        end

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

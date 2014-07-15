require 'sinatra'

class Lecture < Sinatra::Base
  set views: 'views', public_folder: 'public'

  get '/' do
    erb :index
  end

  helpers do
    def partial(partial, locals = {})
      # Put underscore in last path component
      file_path = partial.gsub(/(.*)\//, '\1/_')
      full_path = File.join(settings.views, "#{file_path}.erb")

      if view_files('_*.erb').include? full_path
        erb file_path.to_sym, layout: false, locals: locals
      else
        raise "Couldn't find partial '#{partial}' at path '#{full_path}'"
      end
    end

    def view_files(pattern = '*')
      Dir.glob(File.join(settings.views, '**', pattern))
    end
  end
end

run Lecture
